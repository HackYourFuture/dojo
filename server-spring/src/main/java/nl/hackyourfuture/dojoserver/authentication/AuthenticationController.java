package nl.hackyourfuture.dojoserver.authentication;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.authentication.dto.GoogleLoginRequest;
import nl.hackyourfuture.dojoserver.authentication.dto.SessionResponse;
import nl.hackyourfuture.dojoserver.authentication.dto.TokenResponse;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Tokens leave only as cookies: no endpoint here puts one in a response body. */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Authentication and session management")
public class AuthenticationController {
    private final AuthenticationService authenticationService;
    private final AuthenticationCookieManager authenticationCookieManager;

    // Force JSON to protect from login-CSRF
    @PostMapping(path = "/login/google", consumes = MediaType.APPLICATION_JSON_VALUE)
    @SecurityRequirements
    @Operation(summary = "Sign in with Google",
            description = "Exchanges a Google authorization code for a Dojo session and sets the session cookies.")
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
    public SessionResponse login(
            @Valid @RequestBody
            GoogleLoginRequest request,
            HttpServletResponse response) {
        LoginResponse loginResponse = authenticationService.googleLogin(request);
        var accessToken = loginResponse.accessToken();
        var refreshToken = loginResponse.refreshToken();
        authenticationCookieManager.writeAccessToken(response, accessToken.token(), accessToken.expiresAt());
        authenticationCookieManager.writeRefreshToken(response, refreshToken.token(), refreshToken.expiresAt());
        return SessionResponse.from(AuthenticatedUser.from(loginResponse.user()));
    }

    /** Only the access cookie is rewritten: the refresh token keeps the expiry it was given at login. */
    @PostMapping("/refresh")
    @SecurityRequirements
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Renew the session", description = "Issues a new access token cookie from the refresh cookie.")
    @ApiResponse(responseCode = "204", description = "A new access token cookie has been set")
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
    public void refresh(
            @CookieValue(name = AuthenticationCookieManager.REFRESH_COOKIE, required = false)
            String refreshToken,
            HttpServletResponse response) {
        TokenResponse accessToken = authenticationService.refreshToken(refreshToken);
        authenticationCookieManager.writeAccessToken(response, accessToken.token(), accessToken.expiresAt());
    }

    @GetMapping("/session")
    @Operation(summary = "Get the current session", description = "Returns the signed-in user.")
    @ApiResponse(responseCode = "200", description = "The signed-in user")
    @ApiResponse(
            responseCode = "401",
            description = "There is no valid session",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public SessionResponse getSession(@AuthenticationPrincipal
    AuthenticatedUser currentUser) {
        return SessionResponse.from(currentUser);
    }

    /** Always 204, so a client that already lost its cookies can still finish signing out. */
    @PostMapping("/logout")
    @SecurityRequirements
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Sign out", description = "Revokes both session tokens and clears the cookies.")
    @ApiResponse(responseCode = "204", description = "The session has been ended")
    public void logout(
            @CookieValue(name = AuthenticationCookieManager.ACCESS_COOKIE, required = false)
            String accessToken,
            @CookieValue(name = AuthenticationCookieManager.REFRESH_COOKIE, required = false)
            String refreshToken,
            HttpServletResponse response) {
        authenticationService.logout(accessToken, refreshToken);
        authenticationCookieManager.clear(response);
    }
}
