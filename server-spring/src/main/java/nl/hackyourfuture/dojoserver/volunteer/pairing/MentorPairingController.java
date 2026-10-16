package nl.hackyourfuture.dojoserver.volunteer.pairing;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import nl.hackyourfuture.dojoserver.volunteer.pairing.dto.MentorPairingRequest;
import nl.hackyourfuture.dojoserver.volunteer.pairing.dto.MentorPairingResponse;
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
@RequestMapping("/api/volunteers/{volunteerId}/pairings")
@RequiredArgsConstructor
@Tag(name = "Volunteer Pairings", description = "Operations on the mentor pairings")
public class MentorPairingController {

    private final MentorPairingService pairingService;

    @GetMapping
    @Operation(summary = "List the pairings of a mentor",
            description = "Returns every trainee the volunteer mentors or mentored, latest start date first.")
    @ApiResponse(responseCode = "200", description = "The mentor pairings of the volunteer")
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public List<MentorPairingResponse> getPairings(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId) {
        return pairingService.getPairings(volunteerId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add a mentor pairing",
            description = "Pairs the volunteer with a trainee they mentor.")
    @ApiResponse(responseCode = "201", description = "The mentor pairing was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid, or the trainee id does not exist",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public MentorPairingResponse createPairing(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId,
            @Valid @RequestBody
            MentorPairingRequest request) {
        return pairingService.createPairing(volunteerId, request);
    }

    @PutMapping("/{pairingId}")
    @Operation(summary = "Update an existing mentor pairing",
            description = "Replaces the details of the mentor pairing with the given id.")
    @ApiResponse(responseCode = "200", description = "The updated mentor pairing")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid, or the trainee id does not exist",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id or the pairing id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public MentorPairingResponse updatePairing(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId,
            @Parameter(description = "ID of the mentor pairing to update", example = "pK4nW8sLqT")
            @PathVariable
            String pairingId,
            @Valid @RequestBody
            MentorPairingRequest request) {
        return pairingService.updatePairing(volunteerId, pairingId, request);
    }

    @DeleteMapping("/{pairingId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing mentor pairing",
            description = "Permanently deletes the mentor pairing from the volunteer. The trainee is kept.")
    @ApiResponse(responseCode = "204", description = "The mentor pairing has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id or the pairing id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deletePairing(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId,
            @Parameter(description = "ID of the mentor pairing to delete", example = "pK4nW8sLqT")
            @PathVariable
            String pairingId) {
        pairingService.deletePairing(volunteerId, pairingId);
    }
}
