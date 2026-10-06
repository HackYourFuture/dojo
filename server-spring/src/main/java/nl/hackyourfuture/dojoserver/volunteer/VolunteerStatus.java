package nl.hackyourfuture.dojoserver.volunteer;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum VolunteerStatus {
    ACTIVE("active"),
    PAUSED("paused"),
    STOPPED("stopped");

    @JsonValue
    private final String value;
}
