package nl.hackyourfuture.dojoserver.authentication;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.authentication.googleoauth.GoogleOAuthService;
import nl.hackyourfuture.dojoserver.authentication.token.TokenService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final TokenService tokenService;
    private final UserRepository userRepository;
    private final GoogleOAuthService googleOAuthService;
    private final AuthProperties authProperties;

    public void googleLogin() {

    }

    public void refreshToken() {

    }

    public void logout() {

    }
}
