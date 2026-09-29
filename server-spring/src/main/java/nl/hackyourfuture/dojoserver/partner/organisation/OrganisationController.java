package nl.hackyourfuture.dojoserver.partner.organisation;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationPictureResponse;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationRequest;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationResponse;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationSummaryResponse;
import nl.hackyourfuture.dojoserver.picture.PictureResponses;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.node.ObjectNode;

@RestController
@RequestMapping("/api/organisations")
@RequiredArgsConstructor
@Tag(name = "Organisations", description = "Operations on partner organisations")
public class OrganisationController {
    private final OrganisationService organisationService;

    @GetMapping
    @Operation(summary = "List organisations",
            description = "Returns a page of organisation summaries, ordered by name.")
    @ApiResponse(responseCode = "200", description = "The page of organisation summaries")
    @ApiResponse(
            responseCode = "400",
            description = "A request parameter is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public Page<OrganisationSummaryResponse> getOrganisations(
            @Parameter(description = "The direction to order the names in")
            @RequestParam(defaultValue = "ASC")
            Sort.Direction direction,

            @Parameter(description = "Zero-based index of the page to fetch", example = "0")
            @RequestParam(defaultValue = "0")
            @Min(0)
            int page,

            @Parameter(description = "Number of organisations per page", example = "25")
            @RequestParam(defaultValue = "25")
            @Min(1)
            @Max(100)
            int size
    ) {
        return organisationService.getOrganisations(direction, page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get organisation", description = "Returns the profile of a specific organisation")
    @ApiResponse(responseCode = "200", description = "The profile of a specific organisation")
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public OrganisationResponse getOrganisation(
            @Parameter(description = "ID of the organisation to fetch", example = "Xk2pQ9rTbW")
            @PathVariable
            String id
    ) {
        return organisationService.getOrganisation(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new organisation",
            description = "Creates a new organisation profile and returns it with its generated id.")
    @ApiResponse(responseCode = "201", description = "The organisation was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public OrganisationResponse createOrganisation(
            @Valid @RequestBody
            OrganisationRequest request) {
        return organisationService.createOrganisation(request);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update an existing organisation",
            description = "Updates the organisation with the given id. Send only the fields you want to change.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "The fields to change. Every field is optional here, including the ones the schema marks as required.",
            content = @Content(schema = @Schema(implementation = OrganisationRequest.class))
    )
    @ApiResponse(responseCode = "200", description = "The updated organisation")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid, or carries no fields at all",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public OrganisationResponse updateOrganisation(
            @Parameter(description = "ID of the organisation to update", example = "Xk2pQ9rTbW")
            @PathVariable
            String id,
            @RequestBody
            ObjectNode patch) {
        return organisationService.updateOrganisation(id, patch);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing organisation",
            description = "Permanently deletes the organisation profile together with its contact persons and logo.")
    @ApiResponse(responseCode = "204", description = "The organisation has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteOrganisation(
            @Parameter(description = "ID of the organisation to delete", example = "Xk2pQ9rTbW")
            @PathVariable
            String id) {
        organisationService.deleteOrganisation(id);
    }

    // Logo methods
    @GetMapping("/{organisationId}/picture/{pictureId}")
    @Operation(summary = "Get organisation logo", description = "Returns the logo of an organisation.")
    @ApiResponse(
            responseCode = "200",
            description = "The logo file",
            content = @Content(mediaType = "image/jpeg", schema = @Schema(type = "string", format = "binary"))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found, or the picture id is not the organisation's current logo",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public ResponseEntity<InputStreamResource> getPicture(
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        return PictureResponses.of(organisationService.getPicture(organisationId, pictureId));
    }

    @GetMapping("/{organisationId}/picture/{pictureId}/thumbnail")
    @Operation(summary = "Get organisation logo thumbnail",
            description = "Returns a smaller version of the logo of an organisation.")
    @ApiResponse(
            responseCode = "200",
            description = "The thumbnail file",
            content = @Content(mediaType = "image/jpeg", schema = @Schema(type = "string", format = "binary"))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found, or the picture id is not the organisation's current logo",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public ResponseEntity<InputStreamResource> getThumbnail(
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        return PictureResponses.of(organisationService.getThumbnail(organisationId, pictureId));
    }

    @PutMapping(path = "/{id}/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Set organisation logo",
            description = "Uploads a JPEG, PNG, GIF, BMP, TIFF or WebP image as the logo of an organisation, replacing the current one.")
    @ApiResponse(responseCode = "200", description = "The URLs of the new logo and its thumbnail")
    @ApiResponse(
            responseCode = "400",
            description = "The picture is missing, empty, or not a JPEG, PNG, GIF, BMP, TIFF or WebP image",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "413",
            description = "The picture is too large",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public OrganisationPictureResponse setPicture(
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String id,

            @Parameter(description = "The logo file: a JPEG, PNG, GIF, BMP, TIFF or WebP image")
            @RequestParam("picture")
            MultipartFile file
    ) {
        return organisationService.setPicture(id, file);
    }

    @DeleteMapping("/{organisationId}/picture/{pictureId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete organisation logo",
            description = "Deletes the logo of an organisation, together with its thumbnail.")
    @ApiResponse(responseCode = "204", description = "The logo has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The organisation id was not found, or the picture id is not the organisation's current logo",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deletePicture(
            @Parameter(description = "ID of the organisation", example = "Xk2pQ9rTbW")
            @PathVariable
            String organisationId,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        organisationService.deletePicture(organisationId, pictureId);
    }
}
