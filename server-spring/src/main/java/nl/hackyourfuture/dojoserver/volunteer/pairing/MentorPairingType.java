package nl.hackyourfuture.dojoserver.volunteer.pairing;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

// What a volunteer helps a trainee with in a mentor pairing.
@RequiredArgsConstructor
public enum MentorPairingType {
    TECH_MENTORSHIP("tech-mentorship"),
    ENGLISH_MENTORSHIP("english-mentorship"),
    HR_MENTORSHIP("hr-mentorship");

    @JsonValue
    private final String value;
}
