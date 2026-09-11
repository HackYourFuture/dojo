package nl.hackyourfuture.dojoserver.trainee.assessment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import nl.hackyourfuture.dojoserver.trainee.assessment.AssessmentResult;
import nl.hackyourfuture.dojoserver.trainee.assessment.AssessmentType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "An assessment of a trainee, as sent to create or update one")
public record AssessmentRequest(
        @NotNull
        @Schema(description = "The date the assessment took place.", example = "2024-01-15")
        LocalDate date,

        @NotNull
        @Schema(description = "The assessment the trainee took.", example = "core-end-interview")
        AssessmentType type,

        @NotNull
        @Schema(description = "The outcome of the assessment.", example = "passed")
        AssessmentResult result,

        @DecimalMin("0.0")
        @DecimalMax("100.0")
        @Digits(integer = 3, fraction = 1)
        @Schema(description = "The score of the assessment. Leave out for an assessment that is not graded.",
                example = "8.6")
        BigDecimal score,

        @Size(max = 5000)
        @Schema(description = "Free-form notes about this assessment.")
        String comments
) {

    public AssessmentRequest {
        comments = comments == null ? null : comments.strip();
    }
}
