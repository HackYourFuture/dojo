package nl.hackyourfuture.dojoserver.authentication;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.authentication.dto.GoogleLoginRequest;
import nl.hackyourfuture.dojoserver.authentication.dto.TokenResponse;
import nl.hackyourfuture.dojoserver.authentication.googleoauth.GoogleIdentity;
import nl.hackyourfuture.dojoserver.authentication.googleoauth.GoogleOAuthException;
import nl.hackyourfuture.dojoserver.authentication.googleoauth.GoogleOAuthService;
import nl.hackyourfuture.dojoserver.authentication.token.IssuedToken;
import nl.hackyourfuture.dojoserver.authentication.token.Token;
import nl.hackyourfuture.dojoserver.authentication.token.TokenService;
import nl.hackyourfuture.dojoserver.authentication.token.TokenType;
import nl.hackyourfuture.dojoserver.picture.PictureService;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoUnauthorizedException;
import nl.hackyourfuture.dojoserver.shared.media.DownloadedFile;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import java.net.URI;
import java.util.Locale;
import java.util.Objects;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private static final String FAIL_MESSAGE = "Login failed. Please contact the administrator for more details.";
    private static final String ALLOWED_HOSTED_DOMAIN = "hackyourfuture.net";

    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final PictureService pictureService;
    private final GoogleOAuthService googleOAuthService;
    private final AuthProperties authProperties;
    private final RestClient restClient;

    @Transactional
    public LoginResponse googleLogin(GoogleLoginRequest request) {
        if (!authProperties.allowedOrigins().contains(request.redirectURI())) {
            log.warn("Login failed: redirect URI is not an allowed origin");
            throw new DojoBadRequestException("Invalid redirectURI");
        }

        // 1. Get Google identity - validate the auth code against Google oauth servers
        GoogleIdentity googleIdentity;
        try {
            googleIdentity = googleOAuthService.verifyGoogleLogin(request.authCode(), request.redirectURI());
        } catch (GoogleOAuthException e) {
            String causeMessage = e.getCause() == null ? "" : " - " + e.getCause().getMessage();
            log.warn("Login failed: {}{}", e.getMessage(), causeMessage);
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

        return new LoginResponse(user, TokenResponse.from(accessToken), TokenResponse.from(refreshToken));
    }

    @Transactional
    public TokenResponse refreshToken(String refreshToken) {
        Token token = tokenService.verify(refreshToken, TokenType.REFRESH_TOKEN);
        User user = token.getUser();
        tokenService.deleteExpired();
        IssuedToken newAccessToken = tokenService.issue(user, TokenType.ACCESS_TOKEN);
        log.info("Access token refreshed for user id '{}'", user.getId());
        return TokenResponse.from(newAccessToken);
    }

    /** Idempotent: absent, unknown, and already-revoked tokens are all fine. */
    @Transactional
    public void logout(String accessToken, String refreshToken) {
        tokenService.revoke(accessToken);
        tokenService.revoke(refreshToken);
        log.info("Logout completed");
    }

    private static void verifyGoogleIdentity(GoogleIdentity googleIdentity) {
        if (googleIdentity.sub() == null || googleIdentity.email() == null) {
            log.warn("Login failed: Google identity must have both sub and email");
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

        // If possible, download the Google profile image and save it
        syncProfilePicture(user, googleIdentity.imageUrl());
        return user;
    }

    /** In the rare case where the user's Google account email was changed, sync it with dojo's email */
    private void syncEmail(User user, String googleEmail) {
        String newEmail = googleEmail.strip().toLowerCase(Locale.ROOT);
        if (user.getEmail().equalsIgnoreCase(newEmail)) {
            return;
        }
        if (userRepository.existsByEmailIgnoreCase(newEmail)) {
            log.warn("User id '{}' now has Google email '{}', which another user already holds. Not updating.",
                    user.getId(), newEmail);
            return;
        }
        log.warn("Google OAuth email changed for User ID '{}'. Previous email: '{}'. next email: '{}'. "
                + "Updating the DB with the new email", user.getId(), user.getEmail(), newEmail);
        user.setEmail(newEmail);
    }

    private void syncProfilePicture(User user, String googlePictureUrl) {
        if (googlePictureUrl == null || googlePictureUrl.isBlank() || user.getPictureId() != null) {
            return;
        }
        // Google serves 96px by default; ask for the 700px PictureService stores. Replace =s96-c to =s700-c
        String url = googlePictureUrl.replaceFirst("=s\\d+-c$", "=s700-c");
        try {
            ResponseEntity<byte[]> response = restClient.get().uri(URI.create(url)).retrieve().toEntity(byte[].class);
            byte[] data = Objects.requireNonNullElse(response.getBody(), new byte[0]);
            pictureService.save(user, new DownloadedFile(
                    "GooglePicture",
                    data,
                    response.getHeaders().getFirst(HttpHeaders.CONTENT_TYPE))
            );
        } catch (RestClientResponseException e) {
            log.warn("Could not download the Google profile picture for user id '{}': {}", user.getId(),
                    e.getStatusCode());
        } catch (RuntimeException e) {
            log.warn("Could not sync the Google profile picture for user id '{}': {}", user.getId(), e.getMessage());
        }
    }
}
