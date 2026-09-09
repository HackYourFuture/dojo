package nl.hackyourfuture.dojoserver.trainee.employmenthistory.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import nl.hackyourfuture.dojoserver.trainee.employmenthistory.EmploymentType;

import java.math.BigDecimal;
import java.time.LocalDate;

@Schema(description = "An employment record of a trainee, as sent to create or update one")
public record EmploymentHistoryRequest(
        @NotNull
        @Schema(description = "The type of the employment", example = "job")
        EmploymentType type,

        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "The name of the employer.", example = "HackYourFuture")
        String companyName,

        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "The job title the trainee holds.", example = "Frontend developer")
        String role,

        @NotNull
        @Schema(description = "The date the trainee started the position.", example = "2024-01-15")
        LocalDate startDate,

        @Schema(description = "The date the position ended.",
                example = "2025-01-15")
        LocalDate endDate,

        @NotNull
        @Schema(description = "Whether HackYourFuture collected a placement fee for this position.", example = "true")
        Boolean feeCollected,

        @DecimalMin("0.00")
        @Digits(integer = 8, fraction = 2)
        @Schema(description = "The placement fee in euros.", example = "500.00")
        BigDecimal feeAmount,

        @Size(max = 5000)
        @Schema(description = "Free-form notes about this position.")
        String comments
) {

    public EmploymentHistoryRequest {
        companyName = companyName == null ? null : companyName.strip();
        role = role == null ? null : role.strip();
        comments = comments == null ? null : comments.strip();
    }
}
