package nl.hackyourfuture.dojoserver.search.dto;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

// What kind of record a search result points to: one constant per searchable type.
@RequiredArgsConstructor
public enum SearchResultType {
    TRAINEE("trainee"),
    ORGANISATION("organisation"),
    CONTACT_PERSON("contact-person");

    @JsonValue
    private final String value;
}
