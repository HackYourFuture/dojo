package nl.hackyourfuture.dojoserver.authentication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.authentication.dto.GoogleLoginRequest;
import nl.hackyourfuture.dojoserver.authentication.googleoauth.GoogleIdentity;
import nl.hackyourfuture.dojoserver.authentication.googleoauth.GoogleOAuthService;
import nl.hackyourfuture.dojoserver.authentication.token.IssuedToken;
import nl.hackyourfuture.dojoserver.authentication.token.TokenService;
import nl.hackyourfuture.dojoserver.authentication.token.TokenType;
import nl.hackyourfuture.dojoserver.picture.PictureService;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoUnauthorizedException;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public class AuthenticationServiceTest {

    private static final String ORIGIN = "https://example.org";
    private static final String AUTH_CODE = "auth_code_FjR0jzGdKN";
    private static final String GOOGLE_SUB = "108276490238476";
    private static final String EMAIL = "jane.doe@hackyourfuture.net";
    private static final String HOSTED_DOMAIN = "hackyourfuture.net";

    private final TokenService tokenService = mock(TokenService.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final GoogleOAuthService googleOAuthService = mock(GoogleOAuthService.class);
    private final AuthenticationService authenticationService = authenticationService(HOSTED_DOMAIN);

    private AuthenticationService authenticationService(String allowedDomain) {
        var authProperties = new AuthProperties("client-id-8xqGg", "client-secret-3gMQ", allowedDomain,
                Duration.ofMinutes(15), Duration.ofDays(7), Duration.ofDays(365), true, List.of(ORIGIN));
        return new AuthenticationService(tokenService, userRepository, mock(PictureService.class), googleOAuthService,
                authProperties, mock(RestClient.class));
    }

    @Test
    void googleLoginSuccess() {
        // Arrange
        User user = user(GOOGLE_SUB);
        var googleIdentity = identity(GOOGLE_SUB, EMAIL, true, HOSTED_DOMAIN);
        var accessToken = new IssuedToken("t1", TokenType.ACCESS_TOKEN, "dojo_at_bKq2", user.getId(),
                Instant.parse("2026-09-20T10:15:00Z"));
        var refreshToken = new IssuedToken("t2", TokenType.REFRESH_TOKEN, "dojo_rt_9vPz", user.getId(),
                Instant.parse("2026-10-04T10:00:00Z"));

        when(googleOAuthService.verifyGoogleLogin(AUTH_CODE, ORIGIN)).thenReturn(googleIdentity);
        when(userRepository.findByGoogleId(GOOGLE_SUB)).thenReturn(Optional.of(user));
        when(tokenService.issue(user, TokenType.ACCESS_TOKEN)).thenReturn(accessToken);
        when(tokenService.issue(user, TokenType.REFRESH_TOKEN)).thenReturn(refreshToken);

        // Act
        LoginResponse loginResponse = authenticationService.googleLogin(new GoogleLoginRequest(AUTH_CODE, ORIGIN));

        // Assert
        assertThat(loginResponse.user()).isSameAs(user);
        assertThat(loginResponse.accessToken().token()).isEqualTo("dojo_at_bKq2");
        assertThat(loginResponse.accessToken().type()).isEqualTo(TokenType.ACCESS_TOKEN);
        assertThat(loginResponse.accessToken().expiresAt()).isEqualTo(accessToken.expiresAt());
        assertThat(loginResponse.refreshToken().token()).isEqualTo("dojo_rt_9vPz");
        assertThat(loginResponse.refreshToken().type()).isEqualTo(TokenType.REFRESH_TOKEN);
        assertThat(loginResponse.refreshToken().expiresAt()).isEqualTo(refreshToken.expiresAt());

        // A returning user is matched on the Google sub, so the email is never used to look one up.
        verify(userRepository).findByGoogleId(GOOGLE_SUB);
        verify(userRepository, never()).findByEmailIgnoreCase(any());
        verify(tokenService).deleteExpired();
    }

    @Test
    void googleLoginRefusesARedirectUriThatIsNotAnAllowedOrigin() {
        // Act & Assert - the code is never sent to Google.
        assertThatThrownBy(() -> authenticationService
                .googleLogin(new GoogleLoginRequest(AUTH_CODE, "https://evil.example")))
                .isInstanceOf(DojoBadRequestException.class);
        verify(googleOAuthService, never()).verifyGoogleLogin(any(), any());
        verifyNothingWasIssued();
    }

    @Test
    void googleLoginRefusesAnAccountOutsideTheHostedDomain() {
        // Arrange
        stubGoogle(identity(GOOGLE_SUB, "jane.doe@gmail.com", true, "gmail.com"));

        // Act & Assert
        assertThatThrownBy(this::login).isInstanceOf(DojoUnauthorizedException.class);
        verifyRefusedBeforeTheUserLookup();
    }

    @Test
    void googleLoginRefusesAnAccountWithNoHostedDomain() {
        // Arrange - a personal account reports no Workspace at all.
        stubGoogle(identity(GOOGLE_SUB, "jane.doe@gmail.com", true, null));

        // Act & Assert
        assertThatThrownBy(this::login).isInstanceOf(DojoUnauthorizedException.class);
        verifyRefusedBeforeTheUserLookup();
    }

    @Test
    void googleLoginAcceptsAPersonalAccountWhenNoDomainIsConfigured() {
        // Arrange - how local development signs in: a gmail account reports no hosted domain.
        User user = user(GOOGLE_SUB);
        user.setEmail("jane.doe@gmail.com");
        var token = new IssuedToken("t1", TokenType.ACCESS_TOKEN, "dojo_at_bKq2", user.getId(),
                Instant.parse("2026-09-20T10:15:00Z"));
        stubGoogle(identity(GOOGLE_SUB, "jane.doe@gmail.com", true, null));
        when(userRepository.findByGoogleId(GOOGLE_SUB)).thenReturn(Optional.of(user));
        when(tokenService.issue(any(), any())).thenReturn(token);

        // Act
        LoginResponse loginResponse = authenticationService("").googleLogin(new GoogleLoginRequest(AUTH_CODE, ORIGIN));

        // Assert
        assertThat(loginResponse.user()).isSameAs(user);
    }

    @Test
    void googleLoginStillRefusesAnUnverifiedEmailWhenNoDomainIsConfigured() {
        // Arrange - with no domain to check, the verified email is what ties the account to its owner.
        stubGoogle(identity(GOOGLE_SUB, "jane.doe@gmail.com", false, null));

        // Act & Assert
        assertThatThrownBy(() -> authenticationService("").googleLogin(new GoogleLoginRequest(AUTH_CODE, ORIGIN)))
                .isInstanceOf(DojoUnauthorizedException.class);
        verifyRefusedBeforeTheUserLookup();
    }

    @Test
    void googleLoginRefusesAnUnverifiedEmail() {
        // Arrange
        stubGoogle(identity(GOOGLE_SUB, EMAIL, false, HOSTED_DOMAIN));

        // Act & Assert
        assertThatThrownBy(this::login).isInstanceOf(DojoUnauthorizedException.class);
        verifyRefusedBeforeTheUserLookup();
    }

    @Test
    void googleLoginRefusesAnIdentityWithoutASub() {
        // Arrange - a null sub would otherwise match every user whose google_id is still null.
        stubGoogle(identity(null, EMAIL, true, HOSTED_DOMAIN));

        // Act & Assert
        assertThatThrownBy(this::login).isInstanceOf(DojoUnauthorizedException.class);
        verifyRefusedBeforeTheUserLookup();
    }

    @Test
    void googleLoginRefusesToRebindAUserWhoIsAlreadyBoundToAnotherGoogleAccount() {
        // Arrange - same email, different sub: the email lookup must not adopt the new account.
        User user = user("a-different-sub");
        stubGoogle(identity(GOOGLE_SUB, EMAIL, true, HOSTED_DOMAIN));
        when(userRepository.findByGoogleId(GOOGLE_SUB)).thenReturn(Optional.empty());
        when(userRepository.findByEmailIgnoreCase(EMAIL)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThatThrownBy(this::login).isInstanceOf(DojoUnauthorizedException.class);
        assertThat(user.getGoogleId()).isEqualTo("a-different-sub");
        verifyNothingWasIssued();
    }

    @Test
    void googleLoginRefusesADeactivatedUser() {
        // Arrange
        User user = user(GOOGLE_SUB);
        user.setActive(false);
        stubGoogle(identity(GOOGLE_SUB, EMAIL, true, HOSTED_DOMAIN));
        when(userRepository.findByGoogleId(GOOGLE_SUB)).thenReturn(Optional.of(user));

        // Act & Assert
        assertThatThrownBy(this::login).isInstanceOf(DojoUnauthorizedException.class);
        verifyNothingWasIssued();
    }

    private LoginResponse login() {
        return authenticationService.googleLogin(new GoogleLoginRequest(AUTH_CODE, ORIGIN));
    }

    private void stubGoogle(GoogleIdentity googleIdentity) {
        when(googleOAuthService.verifyGoogleLogin(AUTH_CODE, ORIGIN)).thenReturn(googleIdentity);
    }

    private void verifyNothingWasIssued() {
        verify(tokenService, never()).issue(any(), any());
    }

    /** The identity gate refuses before any lookup, which is what tells it apart from an unknown user. */
    private void verifyRefusedBeforeTheUserLookup() {
        verify(userRepository, never()).findByGoogleId(any());
        verify(userRepository, never()).findByEmailIgnoreCase(any());
        verifyNothingWasIssued();
    }

    private static User user(String googleId) {
        return User.builder()
                .id("WTh1qLhy3K")
                .email(EMAIL)
                .name("Jane Doe")
                .googleId(googleId)
                .pictureId("F5Hn7oqw41")
                .isActive(true)
                .build();
    }

    private static GoogleIdentity identity(String sub, String email, Boolean emailVerified, String hostedDomain) {
        return new GoogleIdentity(sub, email, emailVerified, "Jane Doe", "https://example.org/jane.jpg",
                hostedDomain);
    }
}
