package nl.hackyourfuture.dojoserver.volunteer;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

// What a volunteer can help with. The tracks mirror the trainee Track values, without the legacy one.
@RequiredArgsConstructor
public enum VolunteerExpertise {
    CORE_PROGRAM("core-program"),
    FRONTEND("frontend"),
    BACKEND("backend"),
    DATA("data"),
    TESTER("tester"),
    CLOUD("cloud"),
    PROJECT_MANAGEMENT("project-management"),
    ENGLISH_MENTOR("english-mentor"),
    HR_MENTOR("hr-mentor");

    @JsonValue
    private final String value;
}
