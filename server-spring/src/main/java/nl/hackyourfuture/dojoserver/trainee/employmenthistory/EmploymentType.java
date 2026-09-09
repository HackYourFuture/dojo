package nl.hackyourfuture.dojoserver.trainee.employmenthistory;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum EmploymentType {
    INTERNSHIP("internship"),
    JOB("job");

    @JsonValue
    private final String value;
}
