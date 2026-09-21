package nl.hackyourfuture.dojoserver.authentication;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.authentication.token.Token;
import nl.hackyourfuture.dojoserver.authentication.token.TokenService;
import nl.hackyourfuture.dojoserver.authentication.token.TokenType;
import nl.hackyourfuture.dojoserver.shared.exception.DojoForbiddenException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoUnauthorizedException;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.preauth.PreAuthenticatedAuthenticationToken;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

/**
 * Identifies the caller on every request: a bearer header must carry an API token, the dojo_access_token
 * cookie an access token. A failure leaves the request anonymous rather than answering 401, so the permitAll
 * login and refresh endpoints stay reachable for the caller whose token just expired; AuthorizationFilter
 * produces the 401 further down the chain. The token must be built with the constructor that takes
 * authorities, which is the only one that marks it authenticated - the two-argument one is a request to
 * authenticate, and every protected endpoint would answer 403.
 */
@RequiredArgsConstructor
public class TokenAuthenticationFilter extends OncePerRequestFilter {
    private static final String BEARER_PREFIX = "bearer ";

    private final TokenService tokenService;
    private final AuthenticationCookieManager authenticationCookieManager;

    @Override
    protected void doFilterInternal(
            @NonNull
            HttpServletRequest request,
            @NonNull
            HttpServletResponse response,
            @NonNull
            FilterChain chain
    ) throws ServletException, IOException {
        Optional<Token> token = findToken(request);

        if (token.isPresent()) {
            var authenticatedUser = AuthenticatedUser.from(token.get().getUser());
            var authentication = new PreAuthenticatedAuthenticationToken(authenticatedUser, null, List.of());
            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
        }

        chain.doFilter(request, response);
    }

    private Optional<Token> findToken(HttpServletRequest request) {
        try {
            // Check API token
            Optional<String> bearer = getBearerToken(request);
            if (bearer.isPresent()) {
                return Optional.of(tokenService.verify(bearer.get(), TokenType.API_TOKEN));
            }

            // Check access token in cookies
            Optional<String> accessToken = authenticationCookieManager.getAccessToken(request);
            if (accessToken.isPresent()) {
                return Optional.of(tokenService.verify(accessToken.get(), TokenType.ACCESS_TOKEN));
            }

            // No token found
            return Optional.empty();
        } catch (DojoUnauthorizedException | DojoForbiddenException _) {
            return Optional.empty();
        }
    }

    private static Optional<String> getBearerToken(HttpServletRequest request) {
        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        if (header == null || !header.regionMatches(true, 0, BEARER_PREFIX, 0, BEARER_PREFIX.length())) {
            return Optional.empty();
        }
        String token = header.substring(BEARER_PREFIX.length()).strip();
        return token.isEmpty() ? Optional.empty() : Optional.of(token);
    }
}
