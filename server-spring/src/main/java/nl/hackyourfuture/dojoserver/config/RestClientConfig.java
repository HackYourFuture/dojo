package nl.hackyourfuture.dojoserver.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class RestClientConfig {

    // Boot only provides the Builder. Building from it, not RestClient.create(), is what applies the
    // spring.http.clients timeouts and Boot's message converters.
    @Bean
    public RestClient restClient(RestClient.Builder builder) {
        return builder.build();
    }
}
