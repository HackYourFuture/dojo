package nl.hackyourfuture.dojoserver.trainee.employmenthistory;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import nl.hackyourfuture.dojoserver.trainee.employmenthistory.dto.EmploymentHistoryRequest;
import nl.hackyourfuture.dojoserver.trainee.employmenthistory.dto.EmploymentHistoryResponse;
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
@RequestMapping("/api/trainees/{traineeId}/employment-history")
@RequiredArgsConstructor
@Tag(name = "Trainee Employment", description = "Operations on the employment history of a trainee")
public class EmploymentHistoryController {

    private final EmploymentHistoryService employmentHistoryService;

    @GetMapping
    @Operation(summary = "List the employment history of a trainee",
            description = "Returns every internship and job of the trainee, most recent first.")
    @ApiResponse(responseCode = "200", description = "The employment history of the trainee")
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public List<EmploymentHistoryResponse> getEmploymentHistory(
            @Parameter(description = "ID of the trainee", example = "HpOjvmwXsL")
            @PathVariable
            String traineeId) {
        return employmentHistoryService.getEmploymentHistory(traineeId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add an employment record",
            description = "Adds an internship or job to the employment history of the trainee.")
    @ApiResponse(responseCode = "201", description = "The employment record was created")
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
    public EmploymentHistoryResponse createEmploymentHistory(
            @Parameter(description = "ID of the trainee", example = "HpOjvmwXsL")
            @PathVariable
            String traineeId,
            @Valid @RequestBody
            EmploymentHistoryRequest request) {
        return employmentHistoryService.createEmploymentHistory(traineeId, request);
    }

    @PutMapping("/{employmentHistoryId}")
    @Operation(summary = "Update an existing employment record",
            description = "Replaces the details of the employment record with the given id.")
    @ApiResponse(responseCode = "200", description = "The updated employment record")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id or the employment record id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public EmploymentHistoryResponse updateEmploymentHistory(
            @Parameter(description = "ID of the trainee", example = "HpOjvmwXsL")
            @PathVariable
            String traineeId,
            @Parameter(description = "ID of the employment record to update", example = "g5HQGuL8Zq")
            @PathVariable
            String employmentHistoryId,
            @Valid @RequestBody
            EmploymentHistoryRequest request) {
        return employmentHistoryService.updateEmploymentHistory(traineeId, employmentHistoryId, request);
    }

    @DeleteMapping("/{employmentHistoryId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing employment record",
            description = "Permanently deletes the employment record from the history of the trainee.")
    @ApiResponse(responseCode = "204", description = "The employment record has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id or the employment record id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteEmploymentHistory(
            @Parameter(description = "ID of the trainee", example = "HpOjvmwXsL")
            @PathVariable
            String traineeId,
            @Parameter(description = "ID of the employment record to delete", example = "g5HQGuL8Zq")
            @PathVariable
            String employmentHistoryId) {
        employmentHistoryService.deleteEmploymentHistory(traineeId, employmentHistoryId);
    }
}
