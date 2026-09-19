package nl.hackyourfuture.dojoserver.authentication;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.authentication.dto.GoogleLoginRequest;
import nl.hackyourfuture.dojoserver.authentication.dto.SessionResponse;
import nl.hackyourfuture.dojoserver.authentication.dto.TokenResponse;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and session management")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    // Force JSON to protect from login-CSRF
    @PostMapping(path = "/login/google", consumes = MediaType.APPLICATION_JSON_VALUE)
    @SecurityRequirements
    @Operation(summary = "Sign in with Google",
            description = "Exchanges a Google authorization code for a Dojo session.")
    @ApiResponse(responseCode = "200", description = "The signed-in user")
    @ApiResponse(
            responseCode = "400",
            description = "The request body or the redirect URI is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "401",
            description = "Login failed. This can be due to many reasons. Check the logs for more details.",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "415",
            description = "The request body is not application/json",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public SessionResponse login(@Valid @RequestBody
    GoogleLoginRequest request) {
        LoginResponse loginResponse = authenticationService.googleLogin(request);
        AuthenticatedUser authenticatedUser = AuthenticatedUser.from(loginResponse.user());
        return SessionResponse.from(authenticatedUser);
    }

    // TODO: take the refresh token from the cookie and call the service.
    @PostMapping("/refresh")
    @SecurityRequirements
    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    @Operation(summary = "Renew the session", description = "Issues a new access token from a refresh token.")
    @ApiResponse(responseCode = "501", description = "Not implemented yet")
    public TokenResponse refresh() {
        return null;
    }

    // TODO: return the caller once the authentication filter puts it in the security context.
    @GetMapping("/session")
    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    @Operation(summary = "Get the current session", description = "Returns the signed-in user.")
    @ApiResponse(responseCode = "501", description = "Not implemented yet")
    public SessionResponse getSession() {
        return null;
    }

    // TODO: take both tokens from the cookies and call the service.
    @PostMapping("/logout")
    @SecurityRequirements
    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    @Operation(summary = "Sign out", description = "Revokes both session tokens.")
    @ApiResponse(responseCode = "501", description = "Not implemented yet")
    public void logout() {
    }

}
