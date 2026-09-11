package nl.hackyourfuture.dojoserver.trainee.assessment;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum AssessmentType {
    PRESENTATION("presentation"),
    JAVASCRIPT("javascript"),
    BROWSERS_INTERVIEW("browsers-interview"),
    USING_APIS_INTERVIEW("using-apis-interview"),
    NODEJS("nodejs"),
    REACT_INTERVIEW("react-interview"),
    FINAL_PROJECT_INTERVIEW("final-project-interview"),
    CORE_MID_TERM_INTERVIEW("core-mid-term-interview"),
    CORE_END_INTERVIEW("core-end-interview"),
    FRONTEND_MID_TERM_INTERVIEW("frontend-mid-term-interview"),
    BACKEND_MID_TERM_INTERVIEW("backend-mid-term-interview"),
    CLOUD_MID_TERM_INTERVIEW("cloud-mid-term-interview"),
    DATA_MID_TERM_INTERVIEW("data-mid-term-interview"),
    TESTER_MID_TERM_INTERVIEW("tester-mid-term-interview");

    @JsonValue
    private final String value;
}
