package nl.hackyourfuture.dojoserver.shared;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Server error message")
public record DojoError(
        @Schema(description = "A full description of the error message.", requiredMode = Schema.RequiredMode.REQUIRED)
        String error
) {  }
