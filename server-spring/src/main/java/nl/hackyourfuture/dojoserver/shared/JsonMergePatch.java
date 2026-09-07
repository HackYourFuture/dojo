package nl.hackyourfuture.dojoserver.shared;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

import java.util.Set;

/**
 * Applies a PATCH body to a request record the way RFC 7386 describes for a flat object: the keys
 * the caller sent win, null included, and everything else keeps its current value. The merged
 * record is then validated as a whole, so the create rules apply to whatever the caller changed.
 */
@Component
@RequiredArgsConstructor
public class JsonMergePatch {
    private final ObjectMapper objectMapper;
    private final Validator validator;

    public <T> T apply(T current, ObjectNode patch) {
        if (patch.isEmpty()) {
            throw new DojoBadRequestException("Provide at least one field to update.");
        }

        // Jackson 3.1+ (databind #3079) updates a record by rebuilding it through its canonical
        // constructor, so the compact-constructor normalisation runs on the merged values as well.
        T merged = objectMapper.readerForUpdating(current).readValue(patch);

        Set<ConstraintViolation<T>> violations = validator.validate(merged);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }
        return merged;
    }
}
