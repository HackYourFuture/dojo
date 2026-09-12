package nl.hackyourfuture.dojoserver.auth.token;

import java.time.Instant;

/**
 * A freshly issued token, including the plaintext value. That value exists only here and in the
 * response that carries it: the database holds its hash, so it can never be recovered later.
 */
public record IssuedToken(String id, TokenType type, String plaintextToken, String userId, Instant expiresAt) {

    public static IssuedToken from(Token token, String plaintextToken) {
        return new IssuedToken(
                token.getId(),
                token.getType(),
                plaintextToken,
                token.getUser().getId(),
                token.getExpiresAt());
    }
}
