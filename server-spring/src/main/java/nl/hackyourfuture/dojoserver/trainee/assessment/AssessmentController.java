package nl.hackyourfuture.dojoserver.trainee.assessment;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import nl.hackyourfuture.dojoserver.trainee.assessment.dto.AssessmentRequest;
import nl.hackyourfuture.dojoserver.trainee.assessment.dto.AssessmentResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/trainees/{traineeId}/assessments")
@RequiredArgsConstructor
@Tag(name = "Trainee Assessment", description = "Operations on the education records of a trainee")
public class AssessmentController {

    private final AssessmentService assessmentService;

    @GetMapping
    @Operation(summary = "List the assessments of a trainee",
            description = "Returns every assessment the trainee took.")
    @ApiResponse(responseCode = "200", description = "The assessments of the trainee")
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public List<AssessmentResponse> getAssessments(
            @Parameter(description = "ID of the trainee", example = "HpOjvmwXsL")
            @PathVariable
            String traineeId) {
        return assessmentService.getAssessments(traineeId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add an assessment",
            description = "Records the outcome of an assessment the trainee took.")
    @ApiResponse(responseCode = "201", description = "The assessment was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public AssessmentResponse createAssessment(
            @Parameter(description = "ID of the trainee", example = "HpOjvmwXsL")
            @PathVariable
            String traineeId,
            @Valid @RequestBody
            AssessmentRequest request) {
        return assessmentService.createAssessment(traineeId, request);
    }

    @PutMapping("/{assessmentId}")
    @Operation(summary = "Update an existing assessment",
            description = "Replaces the details of the assessment with the given id.")
    @ApiResponse(responseCode = "200", description = "The updated assessment")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id or the assessment id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public AssessmentResponse updateAssessment(
            @Parameter(description = "ID of the trainee", example = "HpOjvmwXsL")
            @PathVariable
            String traineeId,
            @Parameter(description = "ID of the assessment to update", example = "g5HQGuL8Zq")
            @PathVariable
            String assessmentId,
            @Valid @RequestBody
            AssessmentRequest request) {
        return assessmentService.updateAssessment(traineeId, assessmentId, request);
    }

    @DeleteMapping("/{assessmentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing assessment",
            description = "Permanently deletes the assessment from the records of the trainee.")
    @ApiResponse(responseCode = "204", description = "The assessment has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id or the assessment id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteAssessment(
            @Parameter(description = "ID of the trainee", example = "HpOjvmwXsL")
            @PathVariable
            String traineeId,
            @Parameter(description = "ID of the assessment to delete", example = "g5HQGuL8Zq")
            @PathVariable
            String assessmentId) {
        assessmentService.deleteAssessment(traineeId, assessmentId);
    }
}
