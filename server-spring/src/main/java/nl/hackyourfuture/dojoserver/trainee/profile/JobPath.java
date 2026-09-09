package nl.hackyourfuture.dojoserver.trainee.profile;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum JobPath {
    NOT_GRADUATED("not-graduated"),
    SEARCHING("searching"),
    INTERNSHIP("internship"),
    TECH_JOB("tech-job"),
    NON_TECH_JOB("non-tech-job"),
    NOT_SEARCHING("not-searching"),
    OTHER_STUDIES("other-studies"),
    SUPPORT_ENDED("support-ended");

    @JsonValue
    private final String value;
}
