package nl.hackyourfuture.dojoserver.slack;

import org.jspecify.annotations.NonNull;
import org.springframework.boot.context.properties.ConfigurationProperties;

/** Everything under `dojo.slack`. Both values are optional — unset means notifications are off. */
@ConfigurationProperties(prefix = "dojo.slack")
public record SlackProperties(
        String botToken,
        String notificationChannelId
) {
    boolean isConfigured() {
        return hasText(botToken) && hasText(notificationChannelId);
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    @Override
    public @NonNull String toString() {
        return String.format("botToken = *****, notificationChannelId = %s", notificationChannelId);
    }
}
