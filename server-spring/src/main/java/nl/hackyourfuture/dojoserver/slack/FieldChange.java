package nl.hackyourfuture.dojoserver.slack;

/** One changed field for an update notification. */
public record FieldChange(String field, Object from, Object to) {
}
