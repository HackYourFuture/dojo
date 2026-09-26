package nl.hackyourfuture.dojoserver.authentication;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

import jakarta.servlet.http.Cookie;
import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.authentication.googleoauth.GoogleIdentity;
import nl.hackyourfuture.dojoserver.authentication.googleoauth.GoogleOAuthService;
import nl.hackyourfuture.dojoserver.authentication.token.TokenService;
import nl.hackyourfuture.dojoserver.authentication.token.TokenType;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.List;

/**
 * The whole flow over MockMvc with Google stubbed. Transactional, because it
 * runs against the local
 * development database. Cookie POSTs carry an Origin header, exactly as a
 * browser's do.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthenticationFlowTest {

    private static final String ORIGIN = "http://localhost:8888";
    private static final String LOGIN = "/api/auth/login/google";
    private static final String LOGIN_BODY = "{\"authCode\":\"auth_code_FjR0jzGdKN\",\"redirectURI\":\"" + ORIGIN
            + "\"}";
    private static final String ACCESS = AuthenticationCookieManager.ACCESS_COOKIE;
    private static final String REFRESH = AuthenticationCookieManager.REFRESH_COOKIE;

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;
    @MockitoBean
    private GoogleOAuthService googleOAuthService;

    private User user;

    @BeforeEach
    void givenAnActiveUserGoogleWillVouchFor() {
        user = userRepository.save(User.builder()
                .id(RandomUtils.generateRandomId())
                .email("flow-" + RandomUtils.generateRandomId() + "@hackyourfuture.net")
                .name("Flow Tester")
                .isActive(true)
                .build());
        when(googleOAuthService.verifyGoogleLogin(anyString(), anyString())).thenReturn(new GoogleIdentity(
                "sub-" + user.getId(), user.getEmail(), true, user.getName(), null,
                "hackyourfuture.net"));
    }

    // ------------------------------------------------------------------ login

    @Test
    void loginSetsBothCookiesAndKeepsTokensOutOfTheBody() throws Exception {
        MvcTestResult login = login();

        assertThat(login).hasStatus(200);
        assertThat(login.getResponse().getContentAsString())
                .contains("\"userId\":\"" + user.getId() + "\"")
                .doesNotContain("dojo_at_").doesNotContain("dojo_rt_");

        assertThat(login).cookies()
                .containsCookies(ACCESS, REFRESH)
                .hasPath(ACCESS, "/")
                .hasPath(REFRESH, "/api/auth")
                .isHttpOnly(ACCESS, true)
                .isHttpOnly(REFRESH, true);
        assertThat(login.getResponse().getHeaders("Set-Cookie")).hasSize(2)
                .allSatisfy(header -> assertThat(header).contains("SameSite=Strict")
                        .contains("HttpOnly"));
        assertThat(accessCookie(login).getValue()).startsWith("dojo_at_");
        assertThat(refreshCookie(login).getValue()).startsWith("dojo_rt_");
    }

    // ------------------------------------------------ one carrier per token type

    @Test
    void theAccessTokenIsAcceptedOnlyAsACookie() {
        Cookie access = accessCookie(login());

        assertThat(mvc.get().uri("/api/auth/session").cookie(access)).hasStatus(200);
        assertThat(mvc.get().uri("/api/trainees").cookie(access)).hasStatus(200);
        assertThat(mvc.get().uri("/api/trainees").header("Authorization", "Bearer " + access.getValue()))
                .hasStatus(401);
    }

    @Test
    void theApiTokenIsAcceptedOnlyAsABearerHeader() {
        String apiToken = tokenService.issue(user, TokenType.API_TOKEN).plaintextToken();

        assertThat(mvc.get().uri("/api/trainees").header("Authorization", "Bearer " + apiToken)).hasStatus(200);
        assertThat(mvc.get().uri("/api/trainees").cookie(new Cookie(ACCESS, apiToken))).hasStatus(401);
    }

    @Test
    void theRefreshTokenNeverAuthenticatesARequest() {
        Cookie refresh = refreshCookie(login());

        assertThat(mvc.get().uri("/api/trainees").cookie(new Cookie(ACCESS, refresh.getValue())))
                .hasStatus(401);
        assertThat(mvc.get().uri("/api/trainees").header("Authorization", "Bearer " + refresh.getValue()))
                .hasStatus(401);
        assertThat(mvc.get().uri("/api/auth/session").cookie(refresh)).hasStatus(401);
    }

    // ---------------------------------------------------------------- refresh

    @Test
    void refreshSetsANewAccessCookieAndLeavesTheRefreshCookieAlone() {
        Cookie refresh = refreshCookie(login());

        MvcTestResult refreshed = mvc.post().uri("/api/auth/refresh").cookie(refresh).header("Origin", ORIGIN)
                .exchange();
        assertThat(refreshed).hasStatus(204);
        assertThat(refreshed).cookies().containsCookie(ACCESS).doesNotContainCookie(REFRESH);
        assertThat(mvc.get().uri("/api/auth/session").cookie(accessCookie(refreshed))).hasStatus(200);

        // Not rotated: the same refresh token still works.
        assertThat(mvc.post().uri("/api/auth/refresh").cookie(refresh).header("Origin", ORIGIN)).hasStatus(204);

        assertThat(mvc.post().uri("/api/auth/refresh").header("Origin", ORIGIN)).hasStatus(401);
    }

    // ------------------------------------------------------------------- csrf

    @Test
    void aCookieRequestThatChangesDataNeedsAnAllowedOrigin() {
        Cookie access = accessCookie(login());

        assertThat(mvc.post().uri("/api/trainees").cookie(access).header("Origin", "https://evil.example")
                .contentType(MediaType.APPLICATION_JSON).content("{}")).hasStatus(403);
        assertThat(mvc.post().uri("/api/trainees").cookie(access)
                .contentType(MediaType.APPLICATION_JSON).content("{}")).hasStatus(403);

        // With an allowed Origin it reaches the controller, which rejects the empty
        // body instead.
        int allowed = mvc.post().uri("/api/trainees").cookie(access).header("Origin", ORIGIN)
                .contentType(MediaType.APPLICATION_JSON).content("{}").exchange().getResponse()
                .getStatus();
        assertThat(allowed).isNotEqualTo(403).isNotEqualTo(401);

        // Bearer callers are exempt: no page can set Authorization on someone else's
        // behalf.
        String apiToken = tokenService.issue(user, TokenType.API_TOKEN).plaintextToken();
        int bearer = mvc.post().uri("/api/trainees").header("Authorization", "Bearer " + apiToken)
                .header("Origin", "https://evil.example")
                .contentType(MediaType.APPLICATION_JSON).content("{}").exchange().getResponse()
                .getStatus();
        assertThat(bearer).isNotEqualTo(403).isNotEqualTo(401);
    }

    @Test
    void loginRefusesAFormEncodedBodyWhichIsTheLoginCsrfDefence() {
        assertThat(mvc.post().uri(LOGIN).contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .content("authCode=x&redirectURI=" + ORIGIN)).hasStatus(415);
    }

    // ----------------------------------------------------------------- logout

    @Test
    void logoutRevokesBothTokensAndClearsBothCookies() {
        MvcTestResult login = login();
        Cookie access = accessCookie(login);
        Cookie refresh = refreshCookie(login);

        MvcTestResult logout = mvc.post().uri("/api/auth/logout").cookie(access, refresh)
                .header("Origin", ORIGIN)
                .exchange();
        assertThat(logout).hasStatus(204);
        assertThat(logout).cookies()
                .hasMaxAge(ACCESS, Duration.ZERO)
                .hasMaxAge(REFRESH, Duration.ZERO)
                .hasPath(REFRESH, "/api/auth");

        // Immediate, which a JWT could not do.
        assertThat(mvc.get().uri("/api/auth/session").cookie(access)).hasStatus(401);
        assertThat(mvc.post().uri("/api/auth/refresh").cookie(refresh).header("Origin", ORIGIN)).hasStatus(401);

        // Idempotent with nothing at all.
        assertThat(mvc.post().uri("/api/auth/logout")).hasStatus(204);
    }

    // ------------------------------------------------------------ deactivation

    @Test
    void deactivatingTheUserEndsTheSessionOnTheNextRequest() {
        MvcTestResult login = login();
        assertThat(mvc.get().uri("/api/auth/session").cookie(accessCookie(login))).hasStatus(200);

        user.setActive(false);
        userRepository.save(user);

        assertThat(mvc.get().uri("/api/auth/session").cookie(accessCookie(login))).hasStatus(401);
        assertThat(mvc.post().uri("/api/auth/refresh").cookie(refreshCookie(login)).header("Origin", ORIGIN))
                .hasStatus(403);
    }

    // --------------------------------------------------------------- the edges

    @Test
    void anUnauthenticatedRequestGetsADojoErrorNotAContainerPage() throws Exception {
        MvcTestResult result = mvc.get().uri("/api/trainees").exchange();

        assertThat(result).hasStatus(401);
        assertThat(result.getResponse().getHeader("WWW-Authenticate")).isEqualTo("Bearer");
        assertThat(result.getResponse().getContentType()).startsWith("application/json");
        assertThat(result.getResponse().getContentAsString()).contains("\"error\":\"Unauthorized session.");

        // Unmapped paths, Spring's own /logout and a direct /error are all 401: nothing
        // to enumerate.
        assertThat(mvc.get().uri("/api/does-not-exist")).hasStatus(401);
        assertThat(mvc.post().uri("/logout")).hasStatus(401);
        assertThat(mvc.get().uri("/error")).hasStatus(401);
    }

    @Test
    void theDocsAndHealthEndpointsStayOpen() {
        assertThat(mvc.get().uri("/api/docs/openapi")).hasStatus(200);
        assertThat(mvc.get().uri("/actuator/health")).hasStatus(200);
    }

    // ---------------------------------------------------------------- helpers

    private MvcTestResult login() {
        return mvc.post().uri(LOGIN).contentType(MediaType.APPLICATION_JSON).content(LOGIN_BODY).exchange();
    }

    private static Cookie accessCookie(MvcTestResult result) {
        return cookie(result, ACCESS);
    }

    private static Cookie refreshCookie(MvcTestResult result) {
        return cookie(result, REFRESH);
    }

    private static Cookie cookie(MvcTestResult result, String name) {
        Cookie cookie = result.getResponse().getCookie(name);
        assertThat(cookie)
                .as("Set-Cookie " + name + " in "
                        + List.of(result.getResponse().getHeaders("Set-Cookie")))
                .isNotNull();
        return cookie;
    }
}
