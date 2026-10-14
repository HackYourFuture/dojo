package nl.hackyourfuture.dojoserver.volunteer;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

// The assignments a volunteer can take on.
@RequiredArgsConstructor
public enum VolunteerAssignment {
    ASSIGNMENT_REVIEW("assignment-review"),
    TECH_INTERVIEW("tech-interview"),
    TEACHING("teaching"),
    PROJECT_MENTOR("project-mentor"),
    TECH_MENTORSHIP("tech-mentorship"),
    ENGLISH_MENTORSHIP("english-mentorship"),
    HR_MENTORSHIP("hr-mentorship"),
    CONTENT_CREATION("content-creation"),
    WORKSHOP_HOST("workshop-host");

    @JsonValue
    private final String value;
}
