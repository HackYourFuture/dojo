package nl.hackyourfuture.dojoserver.interaction;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.authentication.AuthenticatedUser;
import nl.hackyourfuture.dojoserver.interaction.dto.InteractionRequest;
import nl.hackyourfuture.dojoserver.interaction.dto.InteractionResponse;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import nl.hackyourfuture.dojoserver.shared.ProfileType;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
@RequestMapping("/api/organisations/{organisationId}/interactions")
@RequiredArgsConstructor
@Tag(name = "Organisation Interactions", description = "Operations on the interactions recorded with an organisation")
public class OrganisationInteractionController {

    private final InteractionService interactionService;

    @GetMapping
    @Operation(summary = "List the interactions of an organisation",
            description = "Returns every interaction recorded with the organisation, most recent first.")
    @ApiResponse(responseCode = "200", description = "The interactions of the organisation")
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public List<InteractionResponse> getInteractions(
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId) {
        return interactionService.getInteractions(ProfileType.ORGANISATION, organisationId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Add an interaction",
            description = "Records an interaction that took place with the organisation.")
    @ApiResponse(responseCode = "201", description = "The interaction was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public InteractionResponse createInteraction(
            @AuthenticationPrincipal
            AuthenticatedUser currentUser,
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId,
            @Valid @RequestBody
            InteractionRequest request) {
        return interactionService.createInteraction(currentUser, ProfileType.ORGANISATION, organisationId, request);
    }

    @PutMapping("/{interactionId}")
    @Operation(summary = "Update an existing interaction",
            description = "Replaces the details of the interaction with the given id.")
    @ApiResponse(responseCode = "200", description = "The updated interaction")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "403",
            description = "The current user is not allowed to edit the interaction.",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id or the interaction id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public InteractionResponse updateInteraction(
            @AuthenticationPrincipal
            AuthenticatedUser currentUser,
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId,
            @Parameter(description = "ID of the interaction to update", example = "g5HQGuL8Zq")
            @PathVariable
            String interactionId,
            @Valid @RequestBody
            InteractionRequest request) {
        return interactionService.updateInteraction(currentUser, ProfileType.ORGANISATION, organisationId,
                interactionId, request);
    }

    @DeleteMapping("/{interactionId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing interaction",
            description = "Permanently deletes the interaction from the records of the organisation.")
    @ApiResponse(responseCode = "204", description = "The interaction has been successfully deleted")
    @ApiResponse(
            responseCode = "403",
            description = "The current user is not allowed to delete the interaction.",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id or the interaction id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteInteraction(
            @AuthenticationPrincipal
            AuthenticatedUser currentUser,
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId,
            @Parameter(description = "ID of the interaction to delete", example = "g5HQGuL8Zq")
            @PathVariable
            String interactionId) {
        interactionService.deleteInteraction(currentUser, ProfileType.ORGANISATION, organisationId, interactionId);
    }
}
