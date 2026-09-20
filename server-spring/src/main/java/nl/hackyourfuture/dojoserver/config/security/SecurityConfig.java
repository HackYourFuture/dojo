package nl.hackyourfuture.dojoserver.config.security;

import jakarta.servlet.DispatcherType;
import nl.hackyourfuture.dojoserver.authentication.AuthProperties;
import nl.hackyourfuture.dojoserver.authentication.AuthenticationCookieManager;
import nl.hackyourfuture.dojoserver.authentication.TokenAuthenticationFilter;
import nl.hackyourfuture.dojoserver.authentication.token.TokenService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderNotFoundException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.RequestCacheConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.intercept.AuthorizationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            TokenService tokenService,
            AuthenticationCookieManager authCookieManager,
            AuthProperties authProperties,
            SecurityErrorHandler securityErrorHandler) {
        // Constructed, not injected: Boot registers a Filter bean with the servlet container as well.
        var tokenAuthenticationFilter = new TokenAuthenticationFilter(tokenService, authCookieManager);
        var csrfOriginFilter = new CsrfOriginFilter(authProperties);

        http
                .authorizeHttpRequests(auth -> auth
                        // Open endpoints
                        .requestMatchers(HttpMethod.POST, "/api/auth/login/google").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/refresh").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/logout").permitAll()
                        .requestMatchers("/actuator/health/**").permitAll()
                        .requestMatchers("/api/docs/**").permitAll()
                        .dispatcherTypeMatchers(DispatcherType.ERROR).permitAll()
                        .anyRequest().authenticated())
                // Filter-chain 401s and 403s never reach GlobalExceptionHandler; this gives them its shape.
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(securityErrorHandler)
                        .accessDeniedHandler(securityErrorHandler))
                // Token, then CSRF, then authorization - all after ExceptionTranslationFilter.
                .addFilterBefore(csrfOriginFilter, AuthorizationFilter.class)
                .addFilterBefore(tokenAuthenticationFilter, CsrfOriginFilter.class)
                .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .requestCache(RequestCacheConfigurer::disable)
                // CSRF is CsrfOriginFilter; Spring's logout would mount a redirecting POST /logout of its own.
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)
                .logout(AbstractHttpConfigurer::disable);

        return http.build();
    }

    /**
     * Authentication happens in TokenAuthenticationFilter, so nothing ever delegates here. Declaring this
     * bean is what makes UserDetailsServiceAutoConfiguration back off, rather than it inventing an
     * in-memory user and logging a random password on every start.
     */
    @Bean
    public AuthenticationManager authenticationManager() {
        return authentication -> {
            throw new ProviderNotFoundException("Dojo authenticates with tokens, not an AuthenticationManager.");
        };
    }
}
