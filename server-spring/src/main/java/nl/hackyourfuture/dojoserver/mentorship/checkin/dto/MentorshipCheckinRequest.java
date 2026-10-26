package nl.hackyourfuture.dojoserver.mentorship.checkin.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

@Schema(description = "A check-in of a mentorship, as sent to create or update one")
public record MentorshipCheckinRequest(
        @NotNull
        @PastOrPresent
        @Schema(description = "The date of the check-in. Today or earlier.", example = "2026-05-20")
        LocalDate date,

        @NotBlank
        @Size(max = 5000)
        @Schema(description = "What was discussed or agreed at this check-in.",
                example = "Discussed the final project plan.")
        String notes
) {

    public MentorshipCheckinRequest {
        notes = notes == null ? null : notes.strip();
    }
}
