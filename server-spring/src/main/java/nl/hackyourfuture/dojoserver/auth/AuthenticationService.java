package nl.hackyourfuture.dojoserver.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.auth.token.IssuedToken;
import nl.hackyourfuture.dojoserver.auth.token.TokenService;
import nl.hackyourfuture.dojoserver.auth.token.TokenType;
import nl.hackyourfuture.dojoserver.shared.exception.DojoForbiddenException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final TokenService tokenService;
    private final UserRepository userRepository;

    public void googleLogin(String googleAuthCode) {
        final String FAIL_MESSAGE = "Login failed. Please contact the administrator for more details.";
        // 1. Validate google services with auth
        // 2. extract email from Google auth

        var email = "stas@stas.placeholder";

        // Find and verify the user in Dojo database
        User user = userRepository.findByEmailIgnoreCase(email)
                .filter(User::isActive)
                .orElseThrow(() -> new DojoForbiddenException(FAIL_MESSAGE));

        // Login success - issue tokens
        IssuedToken accessToken = tokenService.issue(user, TokenType.ACCESS_TOKEN);
        IssuedToken refreshToken = tokenService.issue(user, TokenType.REFRESH_TOKEN);
    }

    public void refresh(String accessToken, String refreshToken) {

    }

    public void getSession(String token) {

    }

    public void logout(String token) {

    }

}
