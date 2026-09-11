package nl.hackyourfuture.dojoserver.shared;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/** The kinds of profile Dojo keeps records on. Internal only - never serialised. */
@RequiredArgsConstructor
@Getter
public enum ProfileType {
    TRAINEE("Trainee");

    private final String label;
}
