package nl.hackyourfuture.dojoserver.config;

import lombok.AllArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.stereotype.Component;

@AllArgsConstructor
@Component
public class ServerConfig {
    private final Environment env;
    public boolean isProduction() {
        return getServerEnvironment() == ServerEnvironment.PRODUCTION;
    }

    public boolean isDevelopment() {
        return getServerEnvironment() == ServerEnvironment.DEVELOPMENT;
    }

    public ServerEnvironment getServerEnvironment() {
        if(env.acceptsProfiles(Profiles.of("dev"))) {
            return ServerEnvironment.DEVELOPMENT;
        } else if(env.acceptsProfiles(Profiles.of("test"))) {
            return ServerEnvironment.TEST;
        } else if(env.acceptsProfiles(Profiles.of("prod"))) {
            return ServerEnvironment.PRODUCTION;
        }
        return ServerEnvironment.PRODUCTION;
    }
}
