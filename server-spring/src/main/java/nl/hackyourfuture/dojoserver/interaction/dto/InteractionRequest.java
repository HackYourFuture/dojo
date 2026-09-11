package nl.hackyourfuture.dojoserver.interaction.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import nl.hackyourfuture.dojoserver.interaction.InteractionType;

import java.time.Instant;

@Schema(description = "An interaction with a trainee, as sent to create or update one")
public record InteractionRequest(
        @NotNull
        @Schema(description = "The moment the interaction took place.", example = "2024-01-15T14:30:00Z")
        Instant date,

        @NotNull
        @Schema(description = "The kind of the interaction", example = "feedback")
        InteractionType type,

        @NotBlank
        @Size(max = 200)
        @Schema(description = "A short summary of the interaction.", example = "Discussed final project scope")
        String title,

        @NotBlank
        @Size(max = 5000)
        @Schema(description = "What was discussed during the interaction.")
        String details
) {

    public InteractionRequest {
        title = title == null ? null : title.strip();
        details = details == null ? null : details.strip();
    }
}
