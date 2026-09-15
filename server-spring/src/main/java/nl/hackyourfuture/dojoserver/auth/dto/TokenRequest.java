package nl.hackyourfuture.dojoserver.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;

/** Carries session tokens until they move into cookies. Both are optional: logout is idempotent. */
@Schema(description = "Session tokens issued by /api/auth/login")
public record TokenRequest(
        @Schema(description = "The access token.", example = "dojo_at_FPjG6mkehneo4lRnPBxSao55Khddrlw")
        String accessToken,

        @Schema(description = "The refresh token.", example = "dojo_rt_GQkH7nlfiofp5mSoQCyTbp66Liee9mx")
        String refreshToken
) {
}
