package nl.hackyourfuture.dojoserver.config.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.authentication.AuthProperties;
import nl.hackyourfuture.dojoserver.authentication.AuthenticationCookieManager;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpHeaders;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Set;

/**
 * SameSite=Strict keeps the cookies off cross-site requests; this closes the same-site gap that a
 * sibling *.hackyourfuture.net host would otherwise leave open.
 */
@RequiredArgsConstructor
public class CsrfOriginFilter extends OncePerRequestFilter {
    private static final Set<String> SAFE_METHODS = Set.of("GET", "HEAD", "OPTIONS");

    private final AuthProperties authProperties;

    @Override
    protected void doFilterInternal(HttpServletRequest request, @NonNull
    HttpServletResponse response,
            @NonNull
            FilterChain chain) throws ServletException, IOException {
        if (!SAFE_METHODS.contains(request.getMethod())
                && AuthenticationCookieManager.hasSessionCookie(request)
                && !isAllowedOrigin(request.getHeader(HttpHeaders.ORIGIN))) {
            throw new AccessDeniedException("Cross-site request rejected.");
        }
        chain.doFilter(request, response);
    }

    private boolean isAllowedOrigin(String origin) {
        return origin != null && authProperties.allowedOrigins().contains(origin);
    }
}
