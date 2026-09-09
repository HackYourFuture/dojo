package nl.hackyourfuture.dojoserver.trainee.profile;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum EducationLevel {
    NONE("none"),
    HIGH_SCHOOL("high-school"),
    DIPLOMA("diploma"),
    BACHELORS_DEGREE("bachelors-degree"),
    MASTERS_DEGREE("masters-degree"),
    PHD("phd");

    @JsonValue
    private final String value;
}
