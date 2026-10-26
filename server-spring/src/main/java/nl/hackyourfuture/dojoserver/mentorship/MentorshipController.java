package nl.hackyourfuture.dojoserver.mentorship;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.mentorship.dto.MentorshipRequest;
import nl.hackyourfuture.dojoserver.mentorship.dto.MentorshipResponse;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/mentorships")
@RequiredArgsConstructor
@Tag(name = "Mentorships", description = "The volunteers that mentor or mentored a trainee, and their check-ins.")
public class MentorshipController {

    private final MentorshipService mentorshipService;

    @GetMapping
    @Operation(summary = "List mentorships",
            description = "Returns every mentorship, latest start date first. "
                    + "Filter by volunteer, by trainee or by both to get the mentorships of one side.")
    @ApiResponse(responseCode = "200", description = "The mentorships that match the filters")
    public List<MentorshipResponse> getMentorships(
            @Parameter(description = "Only the mentorships of this volunteer. An unknown id matches nothing.",
                    example = "Vq7mKp2XaB")
            @RequestParam(required = false)
            String volunteerId,
            @Parameter(description = "Only the mentorships of this trainee. An unknown id matches nothing.",
                    example = "c9JoIbbD4x")
            @RequestParam(required = false)
            String traineeId) {
        return mentorshipService.getMentorships(volunteerId, traineeId);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get a mentorship", description = "Returns the mentorship with the given id.")
    @ApiResponse(responseCode = "200", description = "The mentorship")
    @ApiResponse(
            responseCode = "404",
            description = "The mentorship id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public MentorshipResponse getMentorship(
            @Parameter(description = "ID of the mentorship", example = "pK4nW8sLqT")
            @PathVariable
            String id) {
        return mentorshipService.getMentorship(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add a mentorship", description = "Pairs a volunteer with a trainee they mentor.")
    @ApiResponse(responseCode = "201", description = "The mentorship was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid, or the volunteer or trainee id does not exist",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public MentorshipResponse createMentorship(
            @Valid @RequestBody
            MentorshipRequest request) {
        return mentorshipService.createMentorship(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing mentorship",
            description = "Replaces the details of the mentorship with the given id.")
    @ApiResponse(responseCode = "200", description = "The updated mentorship")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid, or the volunteer or trainee id does not exist",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The mentorship id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public MentorshipResponse updateMentorship(
            @Parameter(description = "ID of the mentorship to update", example = "pK4nW8sLqT")
            @PathVariable
            String id,
            @Valid @RequestBody
            MentorshipRequest request) {
        return mentorshipService.updateMentorship(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing mentorship",
            description = "Permanently deletes the mentorship with its check-ins. The volunteer and the trainee are kept.")
    @ApiResponse(responseCode = "204", description = "The mentorship has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The mentorship id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteMentorship(
            @Parameter(description = "ID of the mentorship to delete", example = "pK4nW8sLqT")
            @PathVariable
            String id) {
        mentorshipService.deleteMentorship(id);
    }
}
