package nl.hackyourfuture.dojoserver.authentication.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.authentication.token.IssuedToken;
import nl.hackyourfuture.dojoserver.authentication.token.TokenType;

import java.time.Instant;

@Schema(description = "An issued token. The value is shown once and cannot be retrieved again.")
public record TokenResponse(
        @Schema(
                description = "The token value, to be sent back on subsequent requests",
                example = "dojo_at_FPjG6mkehneo4lRnPBxSao55KhddrlwGwqeED8pDpMY",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String token,

        @Schema(
                description = "What the token may be used for",
                example = "access",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        TokenType type,

        @Schema(
                description = "When the token stops being accepted",
                example = "2026-09-20T14:30:00Z",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        Instant expiresAt
) {
    public static TokenResponse from(IssuedToken token) {
        return new TokenResponse(token.plaintextToken(), token.type(), token.expiresAt());
    }
}
