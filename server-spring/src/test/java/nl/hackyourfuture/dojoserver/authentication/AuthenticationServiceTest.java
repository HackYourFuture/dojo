package nl.hackyourfuture.dojoserver.authentication;

import static org.assertj.core.api.Assertions.assertThat;
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
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

public class AuthenticationServiceTest {

    private static final String ORIGIN = "https://example.org";
    private static final String AUTH_CODE = "auth_code_FjR0jzGdKN";
    private static final String GOOGLE_SUB = "108276490238476";

    private final TokenService tokenService = mock(TokenService.class);
    private final UserRepository userRepository = mock(UserRepository.class);
    private final GoogleOAuthService googleOAuthService = mock(GoogleOAuthService.class);
    private final AuthProperties authProperties =
            new AuthProperties("client-id-8xqGg", "client-secret-3gMQ", Duration.ofMinutes(15), Duration.ofDays(7),
                    Duration.ofDays(365), true, List.of(ORIGIN));

    private final AuthenticationService authenticationService =
            new AuthenticationService(tokenService, userRepository, googleOAuthService, authProperties);

    @Test
    void googleLoginSuccess() {
        // Arrange
        User user = User.builder()
                .id("WTh1qLhy3K")
                .email("jane.doe@hackyourfuture.net")
                .name("Jane Doe")
                .googleId(GOOGLE_SUB)
                .imageUrl("https://example.org/jane.jpg")
                .isActive(true)
                .build();
        var googleIdentity = new GoogleIdentity(GOOGLE_SUB, user.getEmail(), true, user.getName(),
                user.getImageUrl(), "hackyourfuture.net");
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
}
