package nl.hackyourfuture.dojoserver.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.auth.googleoauth.GoogleIdentity;
import nl.hackyourfuture.dojoserver.auth.googleoauth.GoogleOAuthException;
import nl.hackyourfuture.dojoserver.auth.googleoauth.GoogleOAuthService;
import nl.hackyourfuture.dojoserver.auth.token.IssuedToken;
import nl.hackyourfuture.dojoserver.auth.token.Token;
import nl.hackyourfuture.dojoserver.auth.token.TokenService;
import nl.hackyourfuture.dojoserver.auth.token.TokenType;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoUnauthorizedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    // One message for every refusal, so the caller learns nothing about which step said no.
    private static final String FAIL_MESSAGE = "Login failed. Please contact the administrator for more details.";
    private static final String ALLOWED_HOSTED_DOMAIN = "hackyourfuture.net";

    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final GoogleOAuthService googleOAuthService;
    private final AuthProperties authProperties;

    // Spans the Google round trip on purpose: a handful of staff never contend for the pool.
    @Transactional
    public AuthSession googleLogin(String googleAuthCode, String redirectUri) {
        // Google enforces redirect_uri against the registered origins too; this is defence in depth.
        if (!authProperties.allowedOrigins().contains(redirectUri)) {
            // The value is caller-controlled and unbounded until validated, so it is not logged.
            log.warn("Login failed: redirect URI is not an allowed origin");
            throw new DojoBadRequestException("Invalid redirectURI");
        }

        // 1. Get Google identity - validate the auth code against Google oauth servers
        GoogleIdentity googleIdentity;
        try {
            googleIdentity = googleOAuthService.verifyGoogleLogin(googleAuthCode, redirectUri);
        } catch (GoogleOAuthException e) {
            // One WARN line; a probe with bad codes must not cost a stack trace per attempt.
            log.warn("Login failed: {}{}", e.getMessage(),
                    e.getCause() == null ? "" : " - " + e.getCause().getMessage());
            log.debug("Google OAuth failure detail", e);
            throw new DojoUnauthorizedException(FAIL_MESSAGE);
        }

        // 2. Verify Google identity.
        verifyGoogleIdentity(googleIdentity);

        // 3. Find and verify the user in the Dojo database
        User user = findUser(googleIdentity);
        if (!user.isActive()) {
            log.warn("Login failed: User id {} is not active", user.getId());
            throw new DojoUnauthorizedException(FAIL_MESSAGE);
        }

        // 4. Successful login, issue tokens
        log.info("Login succeeded for user id '{}'", user.getId());
        tokenService.deleteExpired();
        IssuedToken accessToken = tokenService.issue(user, TokenType.ACCESS_TOKEN);
        IssuedToken refreshToken = tokenService.issue(user, TokenType.REFRESH_TOKEN);
        return new AuthSession(accessToken, refreshToken);
    }

    /** A new access token from a live refresh token; the refresh token itself is never touched. */
    @Transactional
    public AuthSession refresh(String refreshToken) {
        // Unknown, expired, or the account was deactivated: verify() resolves all three.
        Token token = tokenService.verify(refreshToken, TokenType.REFRESH_TOKEN);
        User user = token.getUser();

        // Access tokens turn over every few minutes; this is where pruning keeps up.
        tokenService.deleteExpired();
        IssuedToken accessToken = tokenService.issue(user, TokenType.ACCESS_TOKEN);
        log.info("Access token refreshed for user id '{}'", user.getId());
        return new AuthSession(accessToken, null);
    }

    /** Idempotent: absent, unknown and already-revoked tokens are all fine. */
    @Transactional
    public void logout(String accessToken, String refreshToken) {
        tokenService.revoke(accessToken);
        tokenService.revoke(refreshToken);
        log.info("Logout completed");
    }

    private static void verifyGoogleIdentity(GoogleIdentity googleIdentity) {
        // Google always sends both; a null sub would match every unbound user in findByGoogleId.
        if (googleIdentity.sub() == null || googleIdentity.email() == null) {
            log.warn("Login failed: Google identity has no sub or no email");
            throw new DojoUnauthorizedException(FAIL_MESSAGE);
        }
        if (!ALLOWED_HOSTED_DOMAIN.equalsIgnoreCase(googleIdentity.hostedDomain())) {
            log.warn("Login failed: Google account '{}' has invalid hosted domain '{}'",
                    googleIdentity.email(),
                    googleIdentity.hostedDomain()
            );
            throw new DojoUnauthorizedException(FAIL_MESSAGE);
        }
        if (!Boolean.TRUE.equals(googleIdentity.emailVerified())) {
            log.warn("Login failed: email is not verified for Google account '{}'", googleIdentity.email());
            throw new DojoUnauthorizedException(FAIL_MESSAGE);
        }
    }

    /**
     * Sub is the identity; email only matches a row nothing is bound to yet, so no row can be taken over by address.
     */
    private User findUser(GoogleIdentity googleIdentity) {
        Optional<User> boundUser = userRepository.findByGoogleId(googleIdentity.sub());
        if (boundUser.isPresent()) {
            User user = boundUser.get();
            syncEmail(user, googleIdentity.email());
            return user;
        }

        User user = userRepository.findByEmailIgnoreCase(googleIdentity.email())
                .filter(candidate -> candidate.getGoogleId() == null)
                .orElseThrow(() -> {
                    log.warn("Login failed: User '{}' is not allowed to login.", googleIdentity.email());
                    return new DojoUnauthorizedException(FAIL_MESSAGE);
                });

        log.info("First login for user Id '{}'. Registering its Google ID.", user.getId());
        user.setGoogleId(googleIdentity.sub());
        return user;
    }

    /** Google is authoritative on the address, but the unique index has the last word. */
    private void syncEmail(User user, String googleEmail) {
        if (user.getEmail().equalsIgnoreCase(googleEmail)) {
            return;
        }
        if (userRepository.existsByEmailIgnoreCase(googleEmail)) {
            log.warn("User id '{}' now has Google email '{}', which another user already holds. Not updating.",
                    user.getId(), googleEmail);
            return;
        }
        log.warn("Google OAuth email changed for User ID '{}'. Previous email: '{}'. next email: '{}'. "
                + "Updating the DB with the new email", user.getId(), user.getEmail(), googleEmail);
        user.setEmail(googleEmail);
    }
}
