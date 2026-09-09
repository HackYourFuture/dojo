package nl.hackyourfuture.dojoserver.trainee.profile;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Track {
    CORE_PROGRAM("core-program"),
    FRONTEND("frontend"),
    BACKEND("backend"),
    DATA("data"),
    TESTER("tester"),
    CLOUD("cloud"),
    FULLSTACK_LEGACY("fullstack-legacy");

    @JsonValue
    private final String value;
}
