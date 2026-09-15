package nl.hackyourfuture.dojoserver.auth.dto;

public record LoginResponse(
        String accessToken,
        String refreshToken
) {
}
