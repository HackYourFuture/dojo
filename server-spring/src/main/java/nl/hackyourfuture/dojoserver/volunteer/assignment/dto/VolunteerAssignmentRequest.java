package nl.hackyourfuture.dojoserver.volunteer.assignment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import nl.hackyourfuture.dojoserver.volunteer.VolunteerAssignmentType;

import java.time.LocalDate;

@Schema(description = "An assignment of a volunteer, as sent to create or update one")
public record VolunteerAssignmentRequest(
        @NotNull
        @Schema(description = "The type of the assignment", example = "tech-mentorship")
        VolunteerAssignmentType type,

        @Min(1)
        @Max(1000)
        @Schema(description = "The estimated total hours the volunteer spends on the assignment.", example = "40")
        Integer estimatedHours,

        @NotNull
        @Schema(description = "The date the assignment started.", example = "2026-03-01")
        LocalDate startDate,

        @Schema(description = "The date the assignment ended.", example = "2026-06-30")
        LocalDate endDate,

        @Size(max = 5000)
        @Schema(description = "Free-form notes about this assignment.")
        String notes
) {

    public VolunteerAssignmentRequest {
        notes = notes == null ? null : notes.strip();
    }
}
