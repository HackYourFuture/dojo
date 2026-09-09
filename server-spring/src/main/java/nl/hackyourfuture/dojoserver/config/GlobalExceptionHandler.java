package nl.hackyourfuture.dojoserver.config;

import jakarta.validation.ConstraintViolationException;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import nl.hackyourfuture.dojoserver.shared.exception.DojoException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.HttpMediaTypeNotAcceptableException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.ServletRequestBindingException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.HandlerMethodValidationException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.exc.InvalidFormatException;
import tools.jackson.databind.exc.MismatchedInputException;

import java.util.Arrays;
import java.util.Objects;
import java.util.stream.Collectors;
import java.util.stream.Stream;

/**
 * Turns exceptions raised by Spring, the servlet container and the persistence layer
 * into a {@link DojoError}, alongside the {@link DojoException}s the application
 * raises on purpose. Anything unlisted becomes a 500.
 */
@RestControllerAdvice
@AllArgsConstructor
@Slf4j
public class GlobalExceptionHandler {
    private static final String UNPARSABLE =
            "Could not parse the request. Make sure that the message format is correct.";

    private final ServerConfig serverConfig;
    private final ObjectMapper objectMapper;

    // ---------------------------------------------------------------- 400

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public DojoError handleValidationErrors(MethodArgumentNotValidException ex) {
        String details = Stream.concat(
                ex.getBindingResult().getFieldErrors().stream()
                        .map(error -> error.getField() + " " + error.getDefaultMessage()),
                ex.getBindingResult().getGlobalErrors().stream()
                        .map(error -> error.getDefaultMessage()))
                .collect(Collectors.joining(", "));
        return buildDojoError(ex, "One or more fields are invalid: " + details);
    }

    @ExceptionHandler(HandlerMethodValidationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public DojoError handleParameterValidationErrors(Exception ex) {
        return buildDojoError(ex, "One or more request parameters are invalid. Please check the values you sent.");
    }

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public DojoError handleConstraintViolation(ConstraintViolationException ex) {
        String details = ex.getConstraintViolations().stream()
                .map(violation -> violation.getPropertyPath() + " " + violation.getMessage())
                .collect(Collectors.joining(", "));
        return buildDojoError(ex, "One or more values are invalid: " + details);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public DojoError handleMalformedMessage(HttpMessageNotReadableException ex) {
        String message;
        // Jackson reports the real problem as a cause, so unwrap it before blaming the whole body.
        if (ex.getCause() instanceof MismatchedInputException cause) {
            message = describeMismatchedInput(cause);
        } else {
            message = UNPARSABLE;
        }
        return buildDojoError(ex, message);
    }

    /**
     * A MismatchedInputException in Jackson happens when your JSON data does not match the Java object
     * type you are trying to create
     */
    @ExceptionHandler(MismatchedInputException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public DojoError handleMismatchedInput(MismatchedInputException ex) {
        return buildDojoError(ex, describeMismatchedInput(ex));
    }

    /** Names the field Jackson choked on and, for an enum, the values it would have accepted. */
    private String describeMismatchedInput(MismatchedInputException ex) {
        String field = fieldPath(ex);
        Class<?> expected = ex.getTargetType();
        if (field.isEmpty() || expected == null) {
            return UNPARSABLE;
        }
        if (expected.isEnum() && ex instanceof InvalidFormatException invalid) {
            String allowedValues = Arrays.stream(expected.getEnumConstants())
                    .map(this::wireValue)
                    .collect(Collectors.joining(", "));

            var message = "'%s' is not a valid value for '%s'. Allowed values: %s.";
            return message.formatted(invalid.getValue(), field, allowedValues);
        }

        var message = "The field '%s' expects a %s. ";
        message += "Please refer to the API documentation at '/api/docs' for the expected format.";
        return message.formatted(field, expected.getSimpleName());
    }

    /** Dotted path to the offending field, empty when Jackson could not name one. */
    private static String fieldPath(MismatchedInputException ex) {
        return ex.getPath().stream()
                .map(JacksonException.Reference::getPropertyName)
                .filter(Objects::nonNull)
                .collect(Collectors.joining("."));
    }

    /** An enum constant as it appears on the wire (its @JsonValue), or its name if that fails. */
    private String wireValue(Object constant) {
        try {
            return objectMapper.convertValue(constant, String.class);
        } catch (IllegalArgumentException _) {
            return ((Enum<?>) constant).name();
        }
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public DojoError handleTypeMismatch(MethodArgumentTypeMismatchException ex) {
        return buildDojoError(ex, "The value of '" + ex.getName()
                + "' has the wrong type. Please refer to the API documentation at '/api/docs' for the expected format.");
    }

    /**
     * Parent of the missing-parameter, missing-header and missing-part exceptions.
     */
    @ExceptionHandler(ServletRequestBindingException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public DojoError handleMissingRequestData(Exception ex) {
        return buildDojoError(ex,
                "The request is missing a required parameter, header or part. Please refer to the API documentation at '/api/docs'.");
    }

    // ---------------------------------------------------------------- 401

    @ExceptionHandler(AuthenticationException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public DojoError handleUnauthenticated(Exception ex) {
        return buildDojoError(ex, "You are not signed in. Please sign in and try again.");
    }

    // ---------------------------------------------------------------- 403

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public DojoError handleAccessDenied(Exception ex) {
        return buildDojoError(ex, "You do not have permission to perform this action.");
    }

    // ---------------------------------------------------------------- 404

    @ExceptionHandler({NoResourceFoundException.class, NoHandlerFoundException.class})
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public DojoError handleNotFound(Exception ex) {
        return buildDojoError(ex,
                "That endpoint does not exist. Please refer to the API documentation at '/api/docs' to get a list of available endpoints.");
    }

    // ---------------------------------------------------------------- 405

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    @ResponseStatus(HttpStatus.METHOD_NOT_ALLOWED)
    public DojoError handleMethodNotAllowed(Exception ex) {
        return buildDojoError(ex,
                "Method not allowed. Please refer to the API documentation at '/api/docs' to get a list of possible methods.");
    }

    // ---------------------------------------------------------------- 406

    /**
     * No body on purpose: any we wrote would be in the format the caller just
     * refused.
     */
    @ExceptionHandler(HttpMediaTypeNotAcceptableException.class)
    @ResponseStatus(HttpStatus.NOT_ACCEPTABLE)
    public void handleNotAcceptable(Exception ex) {
        log.debug("Returning 406: cannot produce any of the requested media types", ex);
    }

    // ---------------------------------------------------------------- 409

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public DojoError handleDataConflict(Exception ex) {
        return buildDojoError(ex, "That value is already in use, or the change conflicts with existing data.");
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public DojoError handleConcurrentUpdate(Exception ex) {
        return buildDojoError(ex,
                "Someone else changed this record while you were editing it. Please reload and try again.");
    }

    // ---------------------------------------------------------------- 413

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    @ResponseStatus(HttpStatus.CONTENT_TOO_LARGE)
    public DojoError handleUploadTooLarge(Exception ex) {
        return buildDojoError(ex, "That file is too large to upload. Please choose a smaller file.");
    }

    // ---------------------------------------------------------------- 415

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    @ResponseStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
    public DojoError handleUnsupportedMediaType(Exception ex) {
        return buildDojoError(ex, "That content type is not supported. This endpoint expects 'application/json'.");
    }

    // -------------------------------------------------- deliberate errors

    /**
     * Each DojoException carries its own status. The message is ours, so prod sees
     * it too.
     */
    @ExceptionHandler(DojoException.class)
    public ResponseEntity<DojoError> handleDojoException(DojoException ex) {
        log.debug("Returning {}: {}", ex.getStatus(), ex.getMessage());
        return ResponseEntity.status(ex.getStatus())
                .contentType(MediaType.APPLICATION_JSON)
                .body(new DojoError(ex.getMessage()));
    }

    // ---------------------------------------------------------------- 500

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public DojoError handleUncaughtErrors(Exception ex) {
        log.error("Unhandled exception", ex);
        return buildDojoError(ex, "Oops! Something went wrong.");
    }

    // ----------------------------------------------------------------

    private DojoError buildDojoError(Exception ex, String message) {
        log.debug("Returning error response: {}", message, ex);
        // Show debug info only in dev environment
        if (serverConfig.isDevelopment() && ex.getMessage() != null) {
            return new DojoError(message + " 🐞 DEBUG INFO: " + ex.getMessage());
        }
        return new DojoError(message);
    }
}
