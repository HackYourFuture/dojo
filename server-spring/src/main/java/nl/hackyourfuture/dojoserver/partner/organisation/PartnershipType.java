package nl.hackyourfuture.dojoserver.partner.organisation;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

// What an organisation can offer HYF.
@RequiredArgsConstructor
public enum PartnershipType {
    VOLUNTEER("volunteer"),
    FUNDING("funding"),
    EMPLOYMENT("employment"),
    EVENTS("events");

    @JsonValue
    private final String value;
}
