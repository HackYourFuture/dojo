package nl.hackyourfuture.dojoserver.auth.token;

public enum TokenType {
    ACCESS_TOKEN, REFRESH_TOKEN, API_TOKEN;

    public String getPrefix() {
        return switch (this) {
            case ACCESS_TOKEN -> "dojo_at_";
            case REFRESH_TOKEN -> "dojo_rt_";
            case API_TOKEN -> "dojo_api_";
        };
    }
}
