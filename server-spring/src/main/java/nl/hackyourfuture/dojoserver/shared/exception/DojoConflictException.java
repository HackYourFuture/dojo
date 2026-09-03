package nl.hackyourfuture.dojoserver.shared.exception;

import org.springframework.http.HttpStatus;

/** A duplicate value, or a record whose current state does not allow the change. */
public class DojoConflictException extends DojoException {

    public DojoConflictException(String message) {
        super(HttpStatus.CONFLICT, message);
    }
}
