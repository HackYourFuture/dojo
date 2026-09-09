package nl.hackyourfuture.dojoserver.trainee.profile;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum FinancialSupport {
    SIDE_JOB("side-job"),
    UITKERING("uitkering"),
    FAMILY("family"),
    SAVINGS("savings"),
    NONE("none");

    @JsonValue
    private final String value;
}
