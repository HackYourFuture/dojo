package nl.hackyourfuture.dojoserver.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.Paths;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.media.Schema;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Configuration
public class OpenApiConfig {

    // The groups of the docs sidebar, in order. Every @Tag belongs in one; the rest end up under "Other".
    private static final List<TagGroup> TAG_GROUPS = List.of(
            new TagGroup("Trainees",
                    List.of("Trainee profiles", "Trainee assessments", "Trainee employment", "Trainee interactions")),
            new TagGroup("Volunteers",
                    List.of("Volunteer profiles", "Volunteer assignments", "Volunteer interactions")),
            new TagGroup("Mentorships", List.of("Mentorships")),
            new TagGroup("Organisations",
                    List.of("Organisation profiles", "Contact persons", "Organisation interactions")),
            new TagGroup("Tools", List.of("Search", "Dashboard", "Cities and countries")),
            new TagGroup("Access", List.of("Sessions", "Users")));

    @Bean
    public OpenAPI backendOpenAPI() throws IOException {
        return new OpenAPI()
                .info(new Info()
                        .title("Dojo API")
                        .description(new ClassPathResource("api-introduction.md")
                                .getContentAsString(StandardCharsets.UTF_8))
                        .version("1.0.0"))
                .servers(List.of(new Server().url("/")))
                .components(new Components()
                        .addSecuritySchemes("apiToken", new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .description("An API token, `dojo_api_…`, for scripts and integrations."))
                        .addSecuritySchemes("sessionCookie", new SecurityScheme()
                                .type(SecurityScheme.Type.APIKEY)
                                .in(SecurityScheme.In.COOKIE)
                                .name("dojo_access_token")
                                .description("The session cookie the web client gets by signing in.")))
                .security(List.of(
                        new SecurityRequirement().addList("apiToken"),
                        new SecurityRequirement().addList("sessionCookie")
                ));
    }

    /**
     * Spring discovers controllers and their methods in an arbitrary order, so without this the docs change
     * order every build. Paths are sorted alphabetically, which puts /api/users ahead of /api/users/{id}, and
     * the tags follow TAG_GROUPS, which Scalar shows as the sections of its sidebar.
     */
    @Bean
    public OpenApiCustomizer sortPathsAndTags() {
        return openApi -> {
            Paths sorted = new Paths();
            sorted.setExtensions(openApi.getPaths().getExtensions());
            openApi.getPaths().entrySet().stream()
                    .sorted(Map.Entry.comparingByKey())
                    .forEach(entry -> sorted.addPathItem(entry.getKey(), entry.getValue()));
            openApi.setPaths(sorted);

            // Scalar leaves out the operations of a tag that is in no group.
            List<String> grouped = TAG_GROUPS.stream().flatMap(group -> group.tags().stream()).toList();
            List<String> others = openApi.getTags().stream()
                    .map(Tag::getName)
                    .filter(name -> !grouped.contains(name))
                    .sorted()
                    .toList();
            List<TagGroup> groups = new ArrayList<>(TAG_GROUPS);
            if (!others.isEmpty()) {
                groups.add(new TagGroup("Other", others));
            }

            List<String> order = groups.stream().flatMap(group -> group.tags().stream()).toList();
            openApi.setTags(openApi.getTags().stream()
                    .sorted(Comparator.comparingInt(tag -> order.indexOf(tag.getName())))
                    .toList());
            openApi.addExtension("x-tagGroups", groups);
        };
    }

    /** springdoc writes a nullable reference as {"type": "null", "$ref": ...}, which only null matches. */
    @Bean
    public OpenApiCustomizer nullableReferences() {
        return openApi -> openApi.getComponents().getSchemas().values().forEach(schema -> {
            Map<String, Schema> properties = schema.getProperties();
            if (properties != null) {
                properties.replaceAll((name, property) -> isNullableReference(property)
                        ? new Schema<>()
                                .anyOf(List.of(new Schema<>().$ref(property.get$ref()),
                                        new Schema<>().types(Set.of("null"))))
                                .description(property.getDescription())
                        : property);
            }
        });
    }

    private static boolean isNullableReference(Schema<?> property) {
        return property.get$ref() != null && property.getTypes() != null && property.getTypes().contains("null");
    }

    record TagGroup(String name, List<String> tags) {
    }
}
