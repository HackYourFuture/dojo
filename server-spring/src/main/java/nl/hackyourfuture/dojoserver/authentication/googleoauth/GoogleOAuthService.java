package nl.hackyourfuture.dojoserver.authentication.googleoauth;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.authentication.AuthProperties;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

/**
 * Turns a Google authorization code into what Google knows about the account.
 */
@Service
@RequiredArgsConstructor
public class GoogleOAuthService {
    private static final String TOKEN_URI = "https://oauth2.googleapis.com/token";
    private static final String USER_INFO_URI = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final AuthProperties authProperties;
    private final RestClient restClient;

    public GoogleIdentity verifyGoogleLogin(String authCode, String redirectUri) {
        String accessToken = exchangeCodeForToken(authCode, redirectUri);
        UserInfo userInfo = getUserInfo(accessToken);

        return new GoogleIdentity(
                userInfo.sub(),
                userInfo.email(),
                userInfo.emailVerified(),
                userInfo.name(),
                userInfo.picture(),
                userInfo.hostedDomain()
        );
    }

    /** The exchange is what proves the code was minted for our client: Google checks the secret. */
    private String exchangeCodeForToken(String authCode, String redirectUri) {
        var form = new LinkedMultiValueMap<String, String>();
        form.add("code", authCode);
        form.add("client_id", authProperties.googleClientId());
        form.add("client_secret", authProperties.googleClientSecret());
        form.add("redirect_uri", redirectUri);
        form.add("grant_type", "authorization_code");

        TokenResponse response;
        try {
            response = restClient.post()
                    .uri(TOKEN_URI)
                    .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                    .body(form)
                    .retrieve()
                    .body(TokenResponse.class);
        } catch (RestClientException ex) {
            throw new GoogleOAuthException("Token exchange failed", ex);
        }

        if (response == null || response.accessToken() == null) {
            throw new GoogleOAuthException("Token exchange returned no access_token");
        }
        return response.accessToken();
    }

    private UserInfo getUserInfo(String accessToken) {
        UserInfo userInfo;
        try {
            userInfo = restClient.get()
                    .uri(USER_INFO_URI)
                    .headers(headers -> headers.setBearerAuth(accessToken))
                    .retrieve()
                    .body(UserInfo.class);
        } catch (RestClientException ex) {
            throw new GoogleOAuthException("Userinfo request failed", ex);
        }

        if (userInfo == null) {
            throw new GoogleOAuthException("Userinfo returned an empty body");
        }
        return userInfo;
    }

    // Only the fields we need. Jackson ignores the rest of Google's response by default.
    private record TokenResponse(
            @JsonProperty("access_token")
            String accessToken
    ) {
    }

    private record UserInfo(
            String sub,
            String email,
            @JsonProperty("email_verified")
            Boolean emailVerified,
            String name,
            String picture,
            @JsonProperty("hd")
            String hostedDomain
    ) {
    }
}
