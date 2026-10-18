package nl.hackyourfuture.dojoserver.shared;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "The body of every error response")
public record DojoError(
        @Schema(description = "What went wrong, in words meant for people",
                requiredMode = Schema.RequiredMode.REQUIRED)
        String error) {
}
