package nl.hackyourfuture.dojoserver.auth;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.auth.dto.LoginRequest;
import nl.hackyourfuture.dojoserver.auth.dto.LoginResponse;
import nl.hackyourfuture.dojoserver.auth.dto.SessionResponse;
import nl.hackyourfuture.dojoserver.auth.dto.TokenRequest;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Tokens travel in the request and response bodies until the cookie layer lands. */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Signing in and out of Dojo")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    // consumes = JSON is the login-CSRF defence: a cross-site form cannot send it, so it cannot post a code.
    @PostMapping(path = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    @SecurityRequirements
    @Operation(summary = "Sign in with Google",
            description = "Exchanges a Google authorization code for a Dojo session and sets the session cookies.")
    @ApiResponse(responseCode = "200", description = "The session tokens")
    @ApiResponse(
            responseCode = "400",
            description = "The request body or the redirect URI is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "401",
            description = "The Google account could not be verified, or it has no active Dojo account",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "415",
            description = "The request body is not application/json",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public LoginResponse login(
            @Valid @RequestBody
            LoginRequest request) {
        AuthSession session = authenticationService.googleLogin(request.authCode(), request.redirectURI());
        return new LoginResponse(session.accessToken().plaintextToken(), session.refreshToken().plaintextToken());
    }

    /** Returns a new access token only: the refresh token is never reissued, so its field comes back null. */
    @PostMapping("/refresh")
    @SecurityRequirements
    @Operation(summary = "Renew the session", description = "Issues a new access token from a refresh token.")
    @ApiResponse(responseCode = "200", description = "The new access token")
    @ApiResponse(
            responseCode = "401",
            description = "The refresh token is missing, unknown or expired",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "403",
            description = "The account is no longer active",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public LoginResponse refresh(
            @RequestBody
            TokenRequest request) {
        AuthSession session = authenticationService.refresh(request.refreshToken());
        return new LoginResponse(session.accessToken().plaintextToken(), null);
    }

    // TODO: return the caller once the authentication filter puts it in the security context.
    @GetMapping("/session")
    @ResponseStatus(HttpStatus.NOT_IMPLEMENTED)
    @Operation(summary = "Get the current session", description = "Returns the signed-in user.")
    @ApiResponse(responseCode = "501", description = "Not implemented yet")
    public SessionResponse getSession() {
        return null;
    }

    /** Always 204, so a client that already lost its tokens can still finish signing out. */
    @PostMapping("/logout")
    @SecurityRequirements
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Sign out", description = "Revokes both session tokens.")
    @ApiResponse(responseCode = "204", description = "The session has been ended")
    public void logout(
            @RequestBody
            TokenRequest request) {
        authenticationService.logout(request.accessToken(), request.refreshToken());
    }
}
