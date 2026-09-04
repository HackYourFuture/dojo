package nl.hackyourfuture.dojoserver.shared.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base class for errors the application raises on purpose. Each subclass fixes the status it
 * means, which lets one handler translate the whole family.
 */
@Getter
public abstract class DojoException extends RuntimeException {

    private final HttpStatus status;

    protected DojoException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}
