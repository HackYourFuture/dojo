package nl.hackyourfuture.dojoserver.authentication;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockCookie;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

public class AuthenticationCookieManagerTest {

    private static final String ACCESS = AuthenticationCookieManager.ACCESS_COOKIE;
    private static final String REFRESH = AuthenticationCookieManager.REFRESH_COOKIE;

    private final AuthenticationCookieManager cookieManager = cookieManager(true);

    private static AuthenticationCookieManager cookieManager(boolean cookieSecure) {
        var authProperties =
                new AuthProperties("client-id-8xqGg", "client-secret-3gMQ", "example.org", Duration.ofMinutes(15),
                        Duration.ofDays(7), Duration.ofDays(365), cookieSecure, List.of("https://example.org"));
        return new AuthenticationCookieManager(authProperties);
    }

    // ------------------------------------------------------------------ write

    @Test
    void writeAccessTokenSetsAHardenedCookieOnEveryPath() {
        // Arrange
        var response = new MockHttpServletResponse();
        Instant expiresAt = Instant.now().plus(Duration.ofMinutes(15));

        // Act
        cookieManager.writeAccessToken(response, "dojo_at_bKq2", expiresAt);

        // Assert
        MockCookie cookie = onlyCookie(response, ACCESS);
        assertThat(cookie.getValue()).isEqualTo("dojo_at_bKq2");
        assertThat(cookie.getPath()).isEqualTo("/");
        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.getSecure()).isTrue();
        assertThat(cookie.getSameSite()).isEqualTo("Strict");
        // No Domain, or every *.hackyourfuture.net host could read and set it.
        assertThat(cookie.getDomain()).isNull();
        // 15 minutes, less whatever the call itself took.
        assertThat(cookie.getMaxAge()).isBetween(880, 900);
    }

    @Test
    void writeRefreshTokenScopesTheCookieToTheAuthEndpoints() {
        // Arrange
        var response = new MockHttpServletResponse();
        Instant expiresAt = Instant.now().plus(Duration.ofDays(7));

        // Act
        cookieManager.writeRefreshToken(response, "dojo_rt_9vPz", expiresAt);

        // Assert
        MockCookie cookie = onlyCookie(response, REFRESH);
        assertThat(cookie.getValue()).isEqualTo("dojo_rt_9vPz");
        // The browser must not send the refresh token anywhere but /api/auth.
        assertThat(cookie.getPath()).isEqualTo("/api/auth");
        assertThat(cookie.isHttpOnly()).isTrue();
        assertThat(cookie.getSameSite()).isEqualTo("Strict");
        assertThat(cookie.getMaxAge())
                .isBetween((int) Duration.ofDays(7).toSeconds() - 20, (int) Duration.ofDays(7).toSeconds());
    }

    @Test
    void cookieSecureIsConfigurableSoLocalHttpDevelopmentWorks() {
        // Arrange
        var response = new MockHttpServletResponse();
        AuthenticationCookieManager insecureCookieManager = cookieManager(false);

        // Act
        insecureCookieManager.writeAccessToken(response, "dojo_at_bKq2", Instant.now().plus(Duration.ofMinutes(15)));

        // Assert
        assertThat(onlyCookie(response, ACCESS).getSecure()).isFalse();
    }

    // ------------------------------------------------------------------ clear

    @Test
    void clearExpiresBothCookiesOnTheSamePathsUsedToWriteThem() {
        // Arrange
        var response = new MockHttpServletResponse();

        // Act
        cookieManager.clear(response);

        // Assert
        assertThat(response.getCookies()).hasSize(2);

        MockCookie access = cookie(response, ACCESS);
        assertThat(access.getMaxAge()).isZero();
        // A different path here would leave the original cookie in the browser.
        assertThat(access.getPath()).isEqualTo("/");

        MockCookie refresh = cookie(response, REFRESH);
        assertThat(refresh.getMaxAge()).isZero();
        assertThat(refresh.getPath()).isEqualTo("/api/auth");
    }

    // ------------------------------------------------------------------- read

    @Test
    void getAccessTokenReadsTheAccessCookieAndIgnoresTheRest() {
        // Arrange
        var request = new MockHttpServletRequest();
        request.setCookies(new Cookie("unrelated", "x"), new Cookie(REFRESH, "dojo_rt_9vPz"),
                new Cookie(ACCESS, "dojo_at_bKq2"));

        // Act
        var accessToken = cookieManager.getAccessToken(request);

        // Assert
        assertThat(accessToken).contains("dojo_at_bKq2");
    }

    @Test
    void getAccessTokenIsEmptyWhenThereIsNoCookieAtAll() {
        // Arrange
        var request = new MockHttpServletRequest();

        // Act
        var accessToken = cookieManager.getAccessToken(request);

        // Assert
        assertThat(accessToken).isEmpty();
    }

    @Test
    void getAccessTokenIsEmptyWhenOnlyTheRefreshCookieIsPresent() {
        // Arrange
        var request = new MockHttpServletRequest();
        request.setCookies(new Cookie(REFRESH, "dojo_rt_9vPz"));

        // Act
        var accessToken = cookieManager.getAccessToken(request);

        // Assert
        assertThat(accessToken).isEmpty();
    }

    @Test
    void getAccessTokenIsEmptyWhenTheCookieIsBlank() {
        // Arrange - a blank value is not a credential; treating it as one would send "" to the token lookup.
        var request = new MockHttpServletRequest();
        request.setCookies(new Cookie(ACCESS, "  "));

        // Act
        var accessToken = cookieManager.getAccessToken(request);

        // Assert
        assertThat(accessToken).isEmpty();
    }

    @Test
    void hasSessionCookieIsTrueForTheAccessCookie() {
        // Arrange
        var request = new MockHttpServletRequest();
        request.setCookies(new Cookie(ACCESS, "dojo_at_bKq2"));

        // Act
        boolean hasSessionCookie = AuthenticationCookieManager.hasSessionCookie(request);

        // Assert
        assertThat(hasSessionCookie).isTrue();
    }

    @Test
    void hasSessionCookieIsTrueForTheRefreshCookieAlone() {
        // Arrange
        var request = new MockHttpServletRequest();
        request.setCookies(new Cookie(REFRESH, "dojo_rt_9vPz"));

        // Act
        boolean hasSessionCookie = AuthenticationCookieManager.hasSessionCookie(request);

        // Assert
        assertThat(hasSessionCookie).isTrue();
    }

    @Test
    void hasSessionCookieIsFalseWithoutEitherSessionCookie() {
        // Arrange
        var request = new MockHttpServletRequest();
        request.setCookies(new Cookie("unrelated", "x"));

        // Act
        boolean hasSessionCookie = AuthenticationCookieManager.hasSessionCookie(request);

        // Assert
        assertThat(hasSessionCookie).isFalse();
    }

    // ---------------------------------------------------------------- helpers

    private static MockCookie onlyCookie(MockHttpServletResponse response, String name) {
        assertThat(response.getCookies()).hasSize(1);
        return cookie(response, name);
    }

    /** MockHttpServletResponse parses the Set-Cookie header we write back into a MockCookie. */
    private static MockCookie cookie(MockHttpServletResponse response, String name) {
        Cookie cookie = response.getCookie(name);
        assertThat(cookie).as("cookie " + name).isNotNull();
        return (MockCookie) cookie;
    }
}
