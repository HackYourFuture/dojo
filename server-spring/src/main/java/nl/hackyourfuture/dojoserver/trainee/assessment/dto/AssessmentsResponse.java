package nl.hackyourfuture.dojoserver.trainee.assessment.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;
import java.util.List;

@Schema(description = "The assessments of a trainee, with their average score")
public record AssessmentsResponse(
        @Schema(
                description = "The mean of the trainee's best score per assessment type. Null until an assessment is scored.",
                example = "8.25",
                requiredMode = Schema.RequiredMode.REQUIRED,
                nullable = true
        )
        BigDecimal averageScore,

        @Schema(
                description = "Every assessment the trainee took, newest first",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        List<AssessmentResponse> assessments
) {
}
