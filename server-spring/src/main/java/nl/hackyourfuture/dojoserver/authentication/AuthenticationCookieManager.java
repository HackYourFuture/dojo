package nl.hackyourfuture.dojoserver.authentication;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.Arrays;
import java.util.Optional;

/** Reads and writes the two session cookies. HttpOnly, so no JavaScript can touch a token. */
@Component
@RequiredArgsConstructor
public class AuthenticationCookieManager {
    // Config
    public static final String ACCESS_COOKIE = "dojo_access_token";
    public static final String REFRESH_COOKIE = "dojo_refresh_token";
    private static final String ACCESS_PATH = "/";
    private static final String REFRESH_PATH = "/api/auth";
    private static final String SAME_SITE_POLICY = "Strict";

    private final AuthProperties authProperties;

    public static boolean hasSessionCookie(HttpServletRequest request) {
        return getCookie(request, ACCESS_COOKIE).isPresent() || getCookie(request, REFRESH_COOKIE).isPresent();
    }

    public Optional<String> getAccessToken(HttpServletRequest request) {
        return getCookie(request, ACCESS_COOKIE);
    }

    public void writeAccessToken(HttpServletResponse response, String token, Instant expiresAt) {
        Duration maxAge = Duration.between(Instant.now(), expiresAt);
        setCookie(response, ACCESS_COOKIE, token, ACCESS_PATH, maxAge);
    }

    public void writeRefreshToken(HttpServletResponse response, String token, Instant expiresAt) {
        Duration maxAge = Duration.between(Instant.now(), expiresAt);
        setCookie(response, REFRESH_COOKIE, token, REFRESH_PATH, maxAge);
    }

    public void clear(HttpServletResponse response) {
        setCookie(response, ACCESS_COOKIE, "", ACCESS_PATH, Duration.ZERO);
        setCookie(response, REFRESH_COOKIE, "", REFRESH_PATH, Duration.ZERO);
    }

    private void setCookie(HttpServletResponse response, String name, String value, String path, Duration maxAge) {
        ResponseCookie cookie = ResponseCookie.from(name, value)
                .httpOnly(true)
                .secure(authProperties.cookieSecure())
                .sameSite(SAME_SITE_POLICY)
                .path(path)
                .maxAge(maxAge)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private static Optional<String> getCookie(HttpServletRequest request, String name) {
        Cookie[] cookies = request.getCookies();

        if (cookies == null) {
            return Optional.empty();
        }
        return Arrays.stream(cookies)
                .filter(cookie -> name.equals(cookie.getName()))
                .map(Cookie::getValue)
                .filter(value -> value != null && !value.isBlank())
                .findFirst();
    }
}
