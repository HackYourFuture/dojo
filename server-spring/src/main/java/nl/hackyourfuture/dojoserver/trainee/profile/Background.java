package nl.hackyourfuture.dojoserver.trainee.profile;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Background {
    REFUGEE("refugee"),
    FAMILY_REUNIFICATION("family-reunification"),
    PARTNER_OF_SKILLED_MIGRANT("partner-of-skilled-migrant"),
    VULNERABLE_GROUP("vulnerable-group"),
    EU_CITIZEN("eu-citizen");

    @JsonValue
    private final String value;
}
