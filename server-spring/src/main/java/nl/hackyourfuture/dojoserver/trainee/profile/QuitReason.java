package nl.hackyourfuture.dojoserver.trainee.profile;

import com.fasterxml.jackson.annotation.JsonValue;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum QuitReason {
    TECHNICAL("technical"),
    SOCIAL_SKILLS("social-skills"),
    PERSONAL("personal"),
    WITHDRAWN("withdrawn"),
    MUNICIPALITY_OR_MONETARY("municipality-or-monetary"),
    LEFT_NL("left-nl"),
    OTHER("other");

    @JsonValue
    private final String value;
}
