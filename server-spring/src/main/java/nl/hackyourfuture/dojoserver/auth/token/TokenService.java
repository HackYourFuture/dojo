package nl.hackyourfuture.dojoserver.auth.token;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.auth.AuthProperties;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.SecurityUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoForbiddenException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoUnauthorizedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class TokenService {
    private static final int TOKEN_LENGTH = 43;
    private static final String INVALID = "Your session is invalid or has expired. Please sign in again.";

    private final TokenRepository tokenRepository;
    private final AuthProperties authProperties;

    @Transactional
    public IssuedToken issue(User user, TokenType type) {
        String plaintextToken = type.getPrefix() + RandomUtils.generateRandomId(TOKEN_LENGTH);
        Token token = Token.builder()
                .id(RandomUtils.generateRandomId())
                .type(type)
                .tokenHash(SecurityUtils.sha256(plaintextToken))
                .user(user)
                .expiresAt(Instant.now().plus(ttlFor(type)))
                .build();

        tokenRepository.save(token);
        return IssuedToken.from(token, plaintextToken);
    }

    @Transactional(readOnly = true)
    public Token verify(String plaintextToken, TokenType expectedType) {
        if (plaintextToken == null || plaintextToken.isBlank()) {
            throw new DojoUnauthorizedException(INVALID);
        }

        Token token = tokenRepository
                .findByTokenHashAndType(SecurityUtils.sha256(plaintextToken), expectedType)
                .orElseThrow(() -> new DojoUnauthorizedException(INVALID));

        if (token.isExpired(Instant.now())) {
            throw new DojoUnauthorizedException(INVALID);
        }

        if (!token.getUser().isActive()) {
            throw new DojoForbiddenException("Your account is no longer active.");
        }

        return token;
    }

    @Transactional
    public void revoke(String plaintextToken) {
        if (plaintextToken == null || plaintextToken.isBlank()) {
            return;
        }
        tokenRepository.deleteByTokenHash(SecurityUtils.sha256(plaintextToken));
    }

    @Transactional
    public void revokeAllForUser(String userId) {
        tokenRepository.deleteByUserId(userId);
    }

    @Transactional
    public void deleteExpired() {
        tokenRepository.deleteByExpiresAtBefore(Instant.now());
    }

    private Duration ttlFor(TokenType type) {
        return switch (type) {
            case ACCESS_TOKEN -> authProperties.accessTokenTtl();
            case REFRESH_TOKEN -> authProperties.refreshTokenTtl();
            case API_TOKEN -> authProperties.apiTokenTtl();
        };
    }
}
