package nl.hackyourfuture.dojoserver.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.Map;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI backendOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("HackYourFuture Final Project Backend API")
                        .description("REST API for the HackYourFuture final project.")
                        .version("1.0.0"))
                .servers(List.of(
                        new Server().url("/").description("This server")))
                .components(new Components()
                        .addSecuritySchemes("bearerAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .in(SecurityScheme.In.HEADER)
                                .scheme("bearer")
                                .description("API token. For integrations; access tokens are not accepted here."))
                        .addSecuritySchemes("cookieAuth", new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .name("dojo_access_token")
                                .description(
                                        "Access token cookie, set by the login endpoint. Used by the web client.")))
                .security(List.of(
                        new SecurityRequirement().addList("bearerAuth"),
                        new SecurityRequirement().addList("cookieAuth")
                ));
    }

    /**
     * Spring discovers controller methods in an arbitrary order, so without this the endpoints
     * show up in a different order every build. Sorting the paths alphabetically keeps the
     * generated docs stable and puts /api/users ahead of /api/users/{id}.
     */
    @Bean
    public OpenApiCustomizer sortPathsAlphabetically() {
        return openApi -> {
            Paths sorted = new Paths();
            sorted.setExtensions(openApi.getPaths().getExtensions());
            openApi.getPaths().entrySet().stream()
                    .sorted(Map.Entry.comparingByKey())
                    .forEach(entry -> sorted.addPathItem(entry.getKey(), entry.getValue()));
            openApi.setPaths(sorted);
        };
    }
}
