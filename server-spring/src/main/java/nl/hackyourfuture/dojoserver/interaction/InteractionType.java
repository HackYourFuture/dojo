package nl.hackyourfuture.dojoserver.interaction;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum InteractionType {
    CALL("call"),
    CHAT("chat"),
    FEEDBACK("feedback"),
    IN_PERSON("in-person"),
    TECH_HOUR("tech-hour"),
    ENGLISH_MENTORSHIP("english-mentorship"),
    TECH_SUPPORT("tech-support"),
    HR_MENTORSHIP("hr-mentorship"),
    GRAD_MENTORSHIP("grad-mentorship"),
    OTHER("other");

    @JsonValue
    private final String value;
}
