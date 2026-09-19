package nl.hackyourfuture.dojoserver.auth.googleoauth;

public record GoogleIdentity(
        String sub,
        String email,
        Boolean emailVerified,
        String name,
        String imageUrl,
        String hostedDomain
) {
}
