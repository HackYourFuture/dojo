package nl.hackyourfuture.dojoserver.shared.exception;

import org.springframework.http.HttpStatus;

/**
 * A record does not exist — or the caller is not allowed to know that it does. Replying "not
 * found" instead of "forbidden" keeps the error from confirming the record exists.
 */
public class DojoNotFoundException extends DojoException {

    /** Pass an opaque id, never an email address or a name. */
    public DojoNotFoundException(String entity, String id) {
        super(HttpStatus.NOT_FOUND, entity + " with id '" + id + "' was not found");
    }

    public DojoNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, message);
    }
}
