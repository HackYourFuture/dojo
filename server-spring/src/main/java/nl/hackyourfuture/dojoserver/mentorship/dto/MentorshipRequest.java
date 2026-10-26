package nl.hackyourfuture.dojoserver.mentorship.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import nl.hackyourfuture.dojoserver.mentorship.MentorshipType;

import java.time.LocalDate;

@Schema(description = "A mentorship, as sent to create or update one")
public record MentorshipRequest(
        @NotBlank
        @Schema(description = "ID of the volunteer that mentors the trainee.", example = "Vq7mKp2XaB")
        String volunteerId,

        @NotBlank
        @Schema(description = "ID of the trainee the volunteer mentors.", example = "c9JoIbbD4x")
        String traineeId,

        @NotNull
        @Schema(description = "What the volunteer mentors the trainee in.", example = "ENGLISH_MENTORSHIP")
        MentorshipType type,

        @NotNull
        @Schema(description = "The date the mentorship started.", example = "2026-03-01")
        LocalDate startDate,

        @Schema(description = "The date the mentorship ended.", example = "2026-06-30")
        LocalDate endDate,

        @Schema(description = "The date of the next planned check-in with the trainee.", example = "2026-06-17")
        LocalDate nextCheckinDate
) {

    public MentorshipRequest {
        volunteerId = volunteerId == null ? null : volunteerId.strip();
        traineeId = traineeId == null ? null : traineeId.strip();
    }
}
