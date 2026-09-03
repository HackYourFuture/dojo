package nl.hackyourfuture.dojoserver.shared.exception;

import org.springframework.http.HttpStatus;

/**
 * The caller may see the record but may not do this to it. If they should not know it exists,
 * throw {@link DojoNotFoundException} instead.
 */
public class DojoForbiddenException extends DojoException {

    public DojoForbiddenException(String message) {
        super(HttpStatus.FORBIDDEN, message);
    }
}
