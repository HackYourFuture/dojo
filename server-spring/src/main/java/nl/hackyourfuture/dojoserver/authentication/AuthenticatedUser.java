package nl.hackyourfuture.dojoserver.authentication;

import nl.hackyourfuture.dojoserver.admin.user.User;
import org.springframework.security.core.AuthenticatedPrincipal;

public record AuthenticatedUser(
        String id,
        String name,
        String email,
        String pictureUrl
) implements AuthenticatedPrincipal {

    /** What Spring and the access logs print as the user: the id, never the whole record. */
    @Override
    public String getName() {
        return id;
    }

    public static AuthenticatedUser from(User user) {
        return new AuthenticatedUser(user.getId(), user.getName(), user.getEmail(), user.getPictureUrl());
    }
}
