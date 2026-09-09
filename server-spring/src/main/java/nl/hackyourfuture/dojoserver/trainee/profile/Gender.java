package nl.hackyourfuture.dojoserver.trainee.profile;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Gender {
    MAN("man"), WOMAN("woman"), NON_BINARY("non-binary"), OTHER("other");

    @JsonValue
    private final String value;
}
