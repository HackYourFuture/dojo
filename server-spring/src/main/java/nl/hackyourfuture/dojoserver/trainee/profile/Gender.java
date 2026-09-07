package nl.hackyourfuture.dojoserver.trainee.profile;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Gender {
    MAN("man"), WOMAN("woman"), NON_BINARY("non-binary"), OTHER("other");

    // The value used on the wire. Jackson reads and writes this instead of the constant name.
    @JsonValue
    private final String value;
}
