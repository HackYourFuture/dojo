package nl.hackyourfuture.dojoserver.authentication;

import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.authentication.dto.TokenResponse;

public record LoginResponse(
        User user,
        TokenResponse accessToken,
        TokenResponse refreshToken
) {
}
