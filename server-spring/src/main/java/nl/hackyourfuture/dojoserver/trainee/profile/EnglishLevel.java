package nl.hackyourfuture.dojoserver.trainee.profile;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum EnglishLevel {
    NEEDS_WORK("needs-work"),
    GOOD("good");

    @JsonValue
    private final String value;
}
