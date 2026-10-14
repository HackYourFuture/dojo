package nl.hackyourfuture.dojoserver.volunteer;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

// The kind of volunteering a volunteer does.
@RequiredArgsConstructor
public enum VolunteerType {
    TECH("tech"),
    PERSONAL_DEVELOPMENT("personal-development");

    @JsonValue
    private final String value;
}
