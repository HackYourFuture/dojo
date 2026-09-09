package nl.hackyourfuture.dojoserver.trainee.profile;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeRequest;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeSummaryResponse;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.node.ObjectNode;

import java.util.List;

@RestController
@RequestMapping("/api/trainees")
@RequiredArgsConstructor
@Tag(name = "Trainees", description = "Operations on trainee profiles")
public class TraineeController {

    private final TraineeService traineeService;

    @GetMapping
    @Operation(summary = "List all trainees",
            description = "Returns a summary of every trainee in Dojo. Fetch /api/trainees/{id} for the full profile.")
    @ApiResponse(responseCode = "200", description = "The list of trainee summaries")
    public List<TraineeSummaryResponse> getTrainees() {
        return traineeService.getAllTrainees();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get trainee", description = "Returns the profile of a specific trainee")
    @ApiResponse(responseCode = "200", description = "The profile of a specific trainee")
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public TraineeResponse getTrainee(
            @Parameter(description = "ID of the trainee to fetch", example = "HpOjvmwXsL")
            @PathVariable
            String id
    ) {
        return traineeService.getTrainee(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new trainee",
            description = "Creates a new trainee profile and returns it with its generated id.")
    @ApiResponse(responseCode = "201", description = "The trainee was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "409",
            description = "The email address is already in use by another trainee.",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public TraineeResponse createTrainee(@Valid @RequestBody
    TraineeRequest request) {
        return traineeService.createTrainee(request);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update an existing trainee",
            description = "Updates the trainee with the given id. Send only the fields you want to change.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "The fields to change. Every field is optional here, including the ones the schema marks as required.",
            content = @Content(schema = @Schema(implementation = TraineeRequest.class))
    )
    @ApiResponse(responseCode = "200", description = "The updated trainee")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid, or carries no fields at all",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "409",
            description = "The email address is already in use by another trainee.",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public TraineeResponse updateTrainee(
            @Parameter(
                    description = "ID of the trainee to update",
                    example = "HpOjvmwXsL")
            @PathVariable
            String id,
            @RequestBody
            ObjectNode patch) {
        return traineeService.updateTrainee(id, patch);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing trainee",
            description = "Permanently deletes the trainee profile from the system.")
    @ApiResponse(responseCode = "204", description = "The trainee has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteTrainee(
            @Parameter(description = "ID of the trainee to delete", example = "HpOjvmwXsL")
            @PathVariable
            String id) {
        traineeService.deleteTrainee(id);
    }
}
