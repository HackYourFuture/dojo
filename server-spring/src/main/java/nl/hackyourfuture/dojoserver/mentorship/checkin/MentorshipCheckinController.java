package nl.hackyourfuture.dojoserver.mentorship.checkin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.mentorship.checkin.dto.MentorshipCheckinRequest;
import nl.hackyourfuture.dojoserver.mentorship.checkin.dto.MentorshipCheckinResponse;
import nl.hackyourfuture.dojoserver.shared.DojoError;
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
@RequestMapping("/api/mentorships/{mentorshipId}/checkins")
@RequiredArgsConstructor
@Tag(name = "Mentorship check-ins",
        description = "The check-ins, follow-ups and updates of a mentorship. The latest one is the mentorship's "
                + "last check-in.")
public class MentorshipCheckinController {

    private final MentorshipCheckinService checkinService;

    @GetMapping
    @Operation(summary = "List the check-ins of a mentorship",
            description = "Returns every check-in of the mentorship, newest first.")
    @ApiResponse(responseCode = "200", description = "The check-ins of the mentorship")
    @ApiResponse(
            responseCode = "404",
            description = "The mentorship id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public List<MentorshipCheckinResponse> getCheckins(
            @Parameter(description = "ID of the mentorship", example = "pK4nW8sLqT")
            @PathVariable
            String mentorshipId) {
        return checkinService.getCheckins(mentorshipId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add a check-in", description = "Records a check-in, follow-up or update of the mentorship.")
    @ApiResponse(responseCode = "201", description = "The check-in was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The mentorship id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public MentorshipCheckinResponse createCheckin(
            @Parameter(description = "ID of the mentorship", example = "pK4nW8sLqT")
            @PathVariable
            String mentorshipId,
            @Valid @RequestBody
            MentorshipCheckinRequest request) {
        return checkinService.createCheckin(mentorshipId, request);
    }

    @PutMapping("/{checkinId}")
    @Operation(summary = "Update an existing check-in",
            description = "Replaces the details of the check-in with the given id.")
    @ApiResponse(responseCode = "200", description = "The updated check-in")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The mentorship id or the check-in id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public MentorshipCheckinResponse updateCheckin(
            @Parameter(description = "ID of the mentorship", example = "pK4nW8sLqT")
            @PathVariable
            String mentorshipId,
            @Parameter(description = "ID of the check-in to update", example = "mY3dQw9LrK")
            @PathVariable
            String checkinId,
            @Valid @RequestBody
            MentorshipCheckinRequest request) {
        return checkinService.updateCheckin(mentorshipId, checkinId, request);
    }

    @DeleteMapping("/{checkinId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing check-in",
            description = "Permanently deletes the check-in from the mentorship.")
    @ApiResponse(responseCode = "204", description = "The check-in has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The mentorship id or the check-in id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteCheckin(
            @Parameter(description = "ID of the mentorship", example = "pK4nW8sLqT")
            @PathVariable
            String mentorshipId,
            @Parameter(description = "ID of the check-in to delete", example = "mY3dQw9LrK")
            @PathVariable
            String checkinId) {
        checkinService.deleteCheckin(mentorshipId, checkinId);
    }
}
