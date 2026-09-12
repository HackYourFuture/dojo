package nl.hackyourfuture.dojoserver.shared.exception;

import org.springframework.http.HttpStatus;

/**
 * The caller is not, or is no longer, signed in. Contrast with {@link DojoForbiddenException}:
 * signed in, but not allowed to do this.
 */
public class DojoUnauthorizedException extends DojoException {

    public DojoUnauthorizedException(String message) {
        super(HttpStatus.UNAUTHORIZED, message);
    }
}
