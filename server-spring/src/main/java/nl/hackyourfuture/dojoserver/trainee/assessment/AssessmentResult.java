package nl.hackyourfuture.dojoserver.trainee.assessment;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum AssessmentResult {
    PASSED("passed"),
    PASSED_WITH_WARNING("passed-with-warning"),
    FAILED("failed"),
    DISQUALIFIED("disqualified");

    @JsonValue
    private final String value;
}
