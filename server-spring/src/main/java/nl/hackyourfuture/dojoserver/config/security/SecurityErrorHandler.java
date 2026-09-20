package nl.hackyourfuture.dojoserver.config.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.config.GlobalExceptionHandler;
import nl.hackyourfuture.dojoserver.config.ServerConfig;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;
import tools.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * 401 and 403 raised inside the filter chain, where {@link GlobalExceptionHandler} never runs, in the
 * same DojoError shape. The messages are copied from there because its builder is private.
 */
@Component
@RequiredArgsConstructor
public class SecurityErrorHandler implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ServerConfig serverConfig;
    private final ObjectMapper objectMapper;

    @Override
    public void commence(@NonNull
    HttpServletRequest request, HttpServletResponse response,
            @NonNull
            AuthenticationException e)
            throws IOException {
        response.setHeader(HttpHeaders.WWW_AUTHENTICATE, "Bearer");
        write(response, HttpStatus.UNAUTHORIZED, "Unauthorized session.", e);
    }

    @Override
    public void handle(@NonNull
    HttpServletRequest request, @NonNull
    HttpServletResponse response,
            @NonNull
            AccessDeniedException e)
            throws IOException {
        write(response, HttpStatus.FORBIDDEN, "You do not have permission to perform this action.", e);
    }

    private void write(HttpServletResponse response, HttpStatus status, String message, Exception e)
            throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());

        String body = serverConfig.isDevelopment() && e.getMessage() != null
                ? message + " 🐞 DEBUG INFO: " + e.getMessage()
                : message;
        objectMapper.writeValue(response.getOutputStream(), new DojoError(body));
    }
}
