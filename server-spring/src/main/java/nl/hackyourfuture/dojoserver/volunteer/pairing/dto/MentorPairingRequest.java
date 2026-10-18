package nl.hackyourfuture.dojoserver.volunteer.pairing.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import nl.hackyourfuture.dojoserver.volunteer.pairing.MentorPairingType;

import java.time.LocalDate;

@Schema(description = "A mentor pairing, as sent to create or update one")
public record MentorPairingRequest(
        @NotBlank
        @Schema(description = "ID of the trainee the volunteer mentors.", example = "c9JoIbbD4x")
        String traineeId,

        @NotNull
        @Schema(description = "What the volunteer mentors the trainee in.", example = "ENGLISH_MENTORSHIP")
        MentorPairingType type,

        @NotNull
        @Schema(description = "The date the pairing started.", example = "2026-03-01")
        LocalDate startDate,

        @PastOrPresent
        @Schema(description = "The date of the last check-in with the trainee.", example = "2026-05-20")
        LocalDate lastCheckinDate,

        @Schema(description = "The date the pairing ended.", example = "2026-06-30")
        LocalDate endDate,

        @Schema(description = "The date of the next planned check-in with the trainee.", example = "2026-06-17")
        LocalDate nextCheckinDate
) {

    public MentorPairingRequest {
        traineeId = traineeId == null ? null : traineeId.strip();
    }
}
