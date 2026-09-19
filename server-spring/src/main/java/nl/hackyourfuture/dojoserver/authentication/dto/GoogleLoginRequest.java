package nl.hackyourfuture.dojoserver.authentication.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "The Google authorization code obtained by the client")
public record GoogleLoginRequest(
        @NotBlank
        @Size(max = 512)
        @Schema(
                description = "One-time authorization code from Google's authorization code flow.",
                example = "4/0AX4..."
        )
        String authCode,

        @NotBlank
        @Size(max = 200)
        @Schema(
                description = "The origin the code was requested from. In Google's popup flow this is the "
                        + "origin of the page that called initCodeClient, and it must match on the exchange.",
                example = "https://dojo.hackyourfuture.net"
        )
        String redirectURI

) {
    public GoogleLoginRequest {
        authCode = authCode == null ? null : authCode.strip();
        redirectURI = redirectURI == null ? null : redirectURI.strip();
    }
}
