package nl.hackyourfuture.dojoserver.auth.googleoauth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withBadRequest;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withException;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withUnauthorizedRequest;

import nl.hackyourfuture.dojoserver.auth.AuthProperties;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;

import java.io.IOException;
import java.time.Duration;
import java.util.List;

public class GoogleOAuthServiceTest {

    private static final String TOKEN_URI = "https://oauth2.googleapis.com/token";
    private static final String USER_INFO_URI = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final RestClient.Builder restClientBuilder = RestClient.builder();
    private final MockRestServiceServer mockRestClient = MockRestServiceServer.bindTo(restClientBuilder).build();
    private final AuthProperties authProperties =
            new AuthProperties("client-id-8xqGg", "client-secret-3gMQ", Duration.ofMinutes(15), Duration.ofDays(7),
                    Duration.ofDays(365), true, List.of("https://example.org"));

    @Test
    void verifyGoogleLoginSuccess() {
        // Arrange
        var expectedForm = new LinkedMultiValueMap<String, String>();
        expectedForm.add("code", "auth_code_FjR0jzGdKN");
        expectedForm.add("client_id", authProperties.googleClientId());
        expectedForm.add("client_secret", authProperties.googleClientSecret());
        expectedForm.add("redirect_uri", "https://example.org");
        expectedForm.add("grant_type", "authorization_code");

        mockRestClient.expect(requestTo(TOKEN_URI))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(content().formData(expectedForm))
                .andRespond(withSuccess("""
                          {"access_token": "google_access_token_UvSXUPhXD27Dpg", "expires_in": 3599,
                          "scope": "openid email profile", "token_type": "Bearer", "id_token": "ignored"}
                        """, MediaType.APPLICATION_JSON));

        mockRestClient.expect(requestTo(USER_INFO_URI))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("Authorization", "Bearer google_access_token_UvSXUPhXD27Dpg"))
                .andRespond(withSuccess("""
                        {"sub": "108276490238476", "email": "test@hackyourfuture.net", "email_verified": true,
                         "name": "Jane Doe", "given_name": "Jane", "picture": "https://example.org/pic.jpg",
                         "hd": "hackyourfuture.net"}
                        """, MediaType.APPLICATION_JSON));

        // Act
        var service = new GoogleOAuthService(authProperties, restClientBuilder.build());
        GoogleIdentity identity = service.verifyGoogleLogin("auth_code_FjR0jzGdKN", "https://example.org");

        // Assert
        assertThat(identity).isEqualTo(new GoogleIdentity(
                "108276490238476",
                "test@hackyourfuture.net",
                true,
                "Jane Doe",
                "https://example.org/pic.jpg",
                "hackyourfuture.net"));
        mockRestClient.verify();
    }

    @Test
    void verifyGoogleLoginPersonalAccount() {
        // Arrange
        mockRestClient.expect(requestTo(TOKEN_URI))
                .andRespond(withSuccess("""
                        {"access_token": "google_access_token_UvSXUPhXD27Dpg", "token_type": "Bearer"}
                        """, MediaType.APPLICATION_JSON));

        mockRestClient.expect(requestTo(USER_INFO_URI))
                .andRespond(withSuccess("""
                        {"sub": "114829370015582", "email": "jane.doe@gmail.com", "name": "Jane Doe",
                         "picture": "https://example.org/personal.jpg"}
                        """, MediaType.APPLICATION_JSON));

        // Act
        var service = new GoogleOAuthService(authProperties, restClientBuilder.build());
        GoogleIdentity identity = service.verifyGoogleLogin("auth_code_FjR0jzGdKN", "https://example.org");

        // Assert
        assertThat(identity).isEqualTo(new GoogleIdentity(
                "114829370015582",
                "jane.doe@gmail.com",
                null,
                "Jane Doe",
                "https://example.org/personal.jpg",
                null));
        mockRestClient.verify();
    }

    @Test
    void verifyGoogleLoginErrorExchange() {
        mockRestClient.expect(requestTo(TOKEN_URI))
                .andRespond(withBadRequest().body("""
                              {"error": "invalid_grant", "error_description": "Bad Request"}
                        """).contentType(MediaType.APPLICATION_JSON));

        // Act
        var service = new GoogleOAuthService(authProperties, restClientBuilder.build());

        // Assert
        assertThatThrownBy(() -> service.verifyGoogleLogin("auth_code_FjR0jzGdKN", "https://example.org"))
                .isInstanceOf(GoogleOAuthException.class);
        mockRestClient.verify();
    }

    @Test
    void verifyGoogleLoginErrorExchangeNoAccessToken() {
        // Arrange - a 200 that is missing the one field we need.
        mockRestClient.expect(requestTo(TOKEN_URI))
                .andRespond(withSuccess("""
                        {"expires_in": 3599, "scope": "openid email profile", "token_type": "Bearer"}
                        """, MediaType.APPLICATION_JSON));

        // Act
        var service = new GoogleOAuthService(authProperties, restClientBuilder.build());

        // Assert
        assertThatThrownBy(() -> service.verifyGoogleLogin("auth_code_FjR0jzGdKN", "https://example.org"))
                .isInstanceOf(GoogleOAuthException.class);
        mockRestClient.verify();
    }

    @Test
    void verifyGoogleLoginErrorExchangeEmptyBody() {
        // Arrange
        mockRestClient.expect(requestTo(TOKEN_URI))
                .andRespond(withSuccess());

        // Act
        var service = new GoogleOAuthService(authProperties, restClientBuilder.build());

        // Assert
        assertThatThrownBy(() -> service.verifyGoogleLogin("auth_code_FjR0jzGdKN", "https://example.org"))
                .isInstanceOf(GoogleOAuthException.class);
        mockRestClient.verify();
    }

    @Test
    void verifyGoogleLoginErrorExchangeUnreachable() {
        // Arrange
        mockRestClient.expect(requestTo(TOKEN_URI))
                .andRespond(withException(new IOException("Connection reset")));

        // Act
        var service = new GoogleOAuthService(authProperties, restClientBuilder.build());

        // Assert
        assertThatThrownBy(() -> service.verifyGoogleLogin("auth_code_FjR0jzGdKN", "https://example.org"))
                .isInstanceOf(GoogleOAuthException.class);
        mockRestClient.verify();
    }

    @Test
    void verifyGoogleLoginErrorUserInfoResponse() {
        // Arrange - the token is fine, the userinfo call is not.
        mockRestClient.expect(requestTo(TOKEN_URI))
                .andRespond(withSuccess("""
                        {"access_token": "google_access_token_UvSXUPhXD27Dpg", "token_type": "Bearer"}
                        """, MediaType.APPLICATION_JSON));

        mockRestClient.expect(requestTo(USER_INFO_URI))
                .andExpect(header("Authorization", "Bearer google_access_token_UvSXUPhXD27Dpg"))
                .andRespond(withUnauthorizedRequest());

        // Act
        var service = new GoogleOAuthService(authProperties, restClientBuilder.build());

        // Assert
        assertThatThrownBy(() -> service.verifyGoogleLogin("auth_code_FjR0jzGdKN", "https://example.org"))
                .isInstanceOf(GoogleOAuthException.class);
        mockRestClient.verify();
    }

    @Test
    void verifyGoogleLoginErrorUserInfoEmptyBody() {
        // Arrange
        mockRestClient.expect(requestTo(TOKEN_URI))
                .andRespond(withSuccess("""
                        {"access_token": "google_access_token_UvSXUPhXD27Dpg", "token_type": "Bearer"}
                        """, MediaType.APPLICATION_JSON));

        mockRestClient.expect(requestTo(USER_INFO_URI)).andRespond(withSuccess());

        // Act
        var service = new GoogleOAuthService(authProperties, restClientBuilder.build());

        // Assert
        assertThatThrownBy(() -> service.verifyGoogleLogin("auth_code_FjR0jzGdKN", "https://example.org"))
                .isInstanceOf(GoogleOAuthException.class);
        mockRestClient.verify();
    }
}
