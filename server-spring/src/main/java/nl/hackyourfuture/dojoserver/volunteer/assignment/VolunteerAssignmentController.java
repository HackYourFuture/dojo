package nl.hackyourfuture.dojoserver.volunteer.assignment;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import nl.hackyourfuture.dojoserver.volunteer.assignment.dto.VolunteerAssignmentRequest;
import nl.hackyourfuture.dojoserver.volunteer.assignment.dto.VolunteerAssignmentResponse;
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
@RequestMapping("/api/volunteers/{volunteerId}/assignments")
@RequiredArgsConstructor
@Tag(name = "Volunteer assignments",
        description = "The work a volunteer took on, such as reviewing assignments, teaching or hosting a workshop.")
public class VolunteerAssignmentController {

    private final VolunteerAssignmentService assignmentService;

    @GetMapping
    @Operation(summary = "List the assignments of a volunteer",
            description = "Returns every assignment of the volunteer, latest start date first.")
    @ApiResponse(responseCode = "200", description = "The assignments of the volunteer")
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public List<VolunteerAssignmentResponse> getAssignments(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId) {
        return assignmentService.getAssignments(volunteerId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add an assignment",
            description = "Adds an assignment the volunteer took on.")
    @ApiResponse(responseCode = "201", description = "The assignment was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public VolunteerAssignmentResponse createAssignment(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId,
            @Valid @RequestBody
            VolunteerAssignmentRequest request) {
        return assignmentService.createAssignment(volunteerId, request);
    }

    @PutMapping("/{assignmentId}")
    @Operation(summary = "Update an existing assignment",
            description = "Replaces the details of the assignment with the given id.")
    @ApiResponse(responseCode = "200", description = "The updated assignment")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id or the assignment id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public VolunteerAssignmentResponse updateAssignment(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId,
            @Parameter(description = "ID of the assignment to update", example = "aR3kWm9TqZ")
            @PathVariable
            String assignmentId,
            @Valid @RequestBody
            VolunteerAssignmentRequest request) {
        return assignmentService.updateAssignment(volunteerId, assignmentId, request);
    }

    @DeleteMapping("/{assignmentId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing assignment",
            description = "Permanently deletes the assignment from the volunteer.")
    @ApiResponse(responseCode = "204", description = "The assignment has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id or the assignment id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteAssignment(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId,
            @Parameter(description = "ID of the assignment to delete", example = "aR3kWm9TqZ")
            @PathVariable
            String assignmentId) {
        assignmentService.deleteAssignment(volunteerId, assignmentId);
    }
}
