package nl.hackyourfuture.dojoserver.filestorage;

import jakarta.validation.constraints.NotBlank;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "dojo.file-storage")
public record FileStorageProperties(
        @NotBlank
        String endpoint,

        @NotBlank
        String region,

        @NotBlank
        String bucket,

        @NotBlank
        String accessKeyId,

        @NotBlank
        String accessKeySecret,

        boolean forceBasePathStyle
) {
}
