package nl.hackyourfuture.dojoserver.auth.googleoauth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import nl.hackyourfuture.dojoserver.auth.AuthProperties;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;

import java.time.Duration;
import java.util.List;

/** Plain unit test: Google is a stub bound to the RestClient, so no Spring context, network or database. */
class GoogleOAuthServiceTest {

    private final RestClient.Builder builder = RestClient.builder();
    private final MockRestServiceServer google = MockRestServiceServer.bindTo(builder).build();

    private final GoogleOAuthService service = new GoogleOAuthService(
            new AuthProperties("client-id", "client-secret", Duration.ofMinutes(15), Duration.ofDays(7),
                    Duration.ofDays(365), true, List.of("http://localhost:5173")),
            builder.build());

    @Test
    void exchangesTheCodeThenReadsTheProfile() {
        // 1. The code goes to the token endpoint as a form, together with our client credentials.
        var expectedForm = new LinkedMultiValueMap<String, String>();
        expectedForm.add("code", "4/0Ab-the-code-from-the-popup");
        expectedForm.add("client_id", "client-id");
        expectedForm.add("client_secret", "client-secret");
        expectedForm.add("redirect_uri", "http://localhost:5173");
        expectedForm.add("grant_type", "authorization_code");

        google.expect(requestTo("https://oauth2.googleapis.com/token"))
                .andExpect(method(HttpMethod.POST))
                .andExpect(content().contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(content().formData(expectedForm))
                .andRespond(withSuccess("""
                        {"access_token": "ya29.google-access-token", "expires_in": 3599,
                         "scope": "openid email profile", "token_type": "Bearer", "id_token": "ignored"}
                        """, MediaType.APPLICATION_JSON));

        // 2. The access token from step 1 is used, once, to read the profile.
        google.expect(requestTo("https://www.googleapis.com/oauth2/v3/userinfo"))
                .andExpect(method(HttpMethod.GET))
                .andExpect(header("Authorization", "Bearer ya29.google-access-token"))
                .andRespond(withSuccess("""
                        {"sub": "108276490238476", "email": "Jane.Doe@hackyourfuture.net", "email_verified": true,
                         "name": "Jane Doe", "given_name": "Jane", "picture": "https://lh3.googleusercontent.com/j",
                         "hd": "hackyourfuture.net"}
                        """, MediaType.APPLICATION_JSON));

        GoogleIdentity identity = service.verifyGoogleLogin("4/0Ab-the-code-from-the-popup", "http://localhost:5173");

        // 3. What comes back is Google's answer, unjudged: fields we did not ask for are dropped, nothing is checked.
        assertThat(identity).isEqualTo(new GoogleIdentity(
                "108276490238476",
                "Jane.Doe@hackyourfuture.net",
                true,
                "Jane Doe",
                "https://lh3.googleusercontent.com/j",
                "hackyourfuture.net"));
        google.verify();
    }
}
