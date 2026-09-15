package nl.hackyourfuture.dojoserver.auth;

import nl.hackyourfuture.dojoserver.auth.token.IssuedToken;

/** The tokens a session runs on; refresh leaves {@code refreshToken} null, because it never reissues one. */
record AuthSession(IssuedToken accessToken, IssuedToken refreshToken) {
}
