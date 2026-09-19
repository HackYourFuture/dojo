package nl.hackyourfuture.dojoserver.authentication.googleoauth;

public class GoogleOAuthException extends RuntimeException {

    public GoogleOAuthException(String message) {
        super(message);
    }

    public GoogleOAuthException(String message, Throwable cause) {
        super(message, cause);
    }
}
