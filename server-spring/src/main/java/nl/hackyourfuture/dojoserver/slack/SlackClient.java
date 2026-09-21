package nl.hackyourfuture.dojoserver.slack;

import com.slack.api.Slack;
import com.slack.api.methods.MethodsClient;
import com.slack.api.methods.request.chat.ChatPostMessageRequest;
import com.slack.api.methods.response.chat.ChatPostMessageResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SlackClient {
    private final SlackProperties slackProperties;
    private final MethodsClient slackApi;
    private final boolean enabled;

    public SlackClient(SlackProperties slackProperties) {
        this.slackProperties = slackProperties;
        this.slackApi = Slack.getInstance().methods(slackProperties.botToken());
        this.enabled = slackProperties.isConfigured();
        if (!enabled) {
            log.info("Slack is not configured. Notifications will be skipped.");
        }
    }

    @Async
    public void sendNotification(String message) {
        if (!enabled) {
            log.debug("Slack is not configured. Skipping notification.");
            return;
        }

        var msg = ChatPostMessageRequest.builder()
                .channel(slackProperties.notificationChannelId())
                .markdownText(message)
                .unfurlLinks(false)
                .build();
        try {
            ChatPostMessageResponse response = slackApi.chatPostMessage(msg);
            if (!response.isOk()) {
                throw new IllegalStateException("Response was not OK: " + response.getError());
            }
            log.info("Slack notification sent");
        } catch (Exception e) {
            log.warn("Failed to send Slack message: {}", e.getMessage());
        }
    }
}
