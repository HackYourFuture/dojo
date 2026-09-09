package nl.hackyourfuture.dojoserver.trainee.profile;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum LearningStatus {
    STUDYING("studying"),
    GRADUATED("graduated"),
    ON_HOLD("on-hold"),
    QUIT("quit");

    @JsonValue
    private final String value;
}
