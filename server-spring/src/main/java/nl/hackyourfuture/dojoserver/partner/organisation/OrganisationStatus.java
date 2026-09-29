package nl.hackyourfuture.dojoserver.partner.organisation;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum OrganisationStatus {
    ACTIVE("active"),
    INACTIVE("inactive"),
    NEVER_ENGAGED("never-engaged");

    @JsonValue
    private final String value;
}
