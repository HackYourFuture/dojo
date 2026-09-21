package nl.hackyourfuture.dojoserver.config;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

/** The top-level `dojo` settings. The `dojo.auth` and `dojo.slack` sub-trees bind to their own records. */
@Validated
@ConfigurationProperties(prefix = "dojo")
public record DojoProperties(
        @NotBlank
        String baseUrl
) {
}
