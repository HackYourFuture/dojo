package nl.hackyourfuture.dojoserver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {
    // Common RestClient. Please use this one instead of creating your own.
    // It uses spring.http.clients timeouts from the configuration
    @Bean
    public RestClient restClient(RestClient.Builder builder) {
        return builder.build();
    }
}
