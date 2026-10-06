package nl.hackyourfuture.dojoserver.slack;

import java.lang.reflect.RecordComponent;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

/** One changed field for an update notification. */
public record FieldChange(String field, Object from, Object to) {

    // The components whose value differs between two instances of the same record type, in declaration order.
    public static List<FieldChange> between(Record current, Record merged) {
        return Arrays.stream(current.getClass().getRecordComponents())
                .filter(component -> !Objects.equals(read(component, current), read(component, merged)))
                .map(component -> new FieldChange(component.getName(), read(component, current),
                        read(component, merged)))
                .toList();
    }

    private static Object read(RecordComponent component, Record instance) {
        try {
            return component.getAccessor().invoke(instance);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException("Cannot read " + component.getName(), e);
        }
    }
}
