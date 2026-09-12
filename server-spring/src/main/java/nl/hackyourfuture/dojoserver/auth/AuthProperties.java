package nl.hackyourfuture.dojoserver.auth;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import java.time.Duration;
import java.util.List;

/** Everything under `dojo.auth` in application.yaml. Bound once at startup and injected as a bean. */
@Validated
@ConfigurationProperties(prefix = "dojo.auth")
public record AuthProperties(
        @NotBlank
        String googleClientId,

        @NotBlank
        String googleClientSecret,

        @NotNull
        Duration accessTokenTtl,

        @NotNull
        Duration refreshTokenTtl,

        @NotNull
        Duration apiTokenTtl,

        boolean cookieSecure,

        @NotEmpty
        List<String> allowedOrigins
) {
}
