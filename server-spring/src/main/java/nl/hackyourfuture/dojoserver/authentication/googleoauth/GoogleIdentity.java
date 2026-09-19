package nl.hackyourfuture.dojoserver.authentication.googleoauth;

public record GoogleIdentity(
        String sub,
        String email,
        Boolean emailVerified,
        String name,
        String imageUrl,
        String hostedDomain
) {
}
