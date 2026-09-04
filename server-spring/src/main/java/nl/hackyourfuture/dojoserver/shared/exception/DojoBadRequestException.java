package nl.hackyourfuture.dojoserver.shared.exception;

import org.springframework.http.HttpStatus;

/**
 * A business rule that bean validation cannot express, such as a graduation date before the
 * cohort started. Single-field shape rules belong on the DTO instead.
 */
public class DojoBadRequestException extends DojoException {

    public DojoBadRequestException(String message) {
        super(HttpStatus.BAD_REQUEST, message);
    }
}
