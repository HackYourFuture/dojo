package nl.hackyourfuture.dojoserver.volunteer;

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
import nl.hackyourfuture.dojoserver.authentication.AuthenticatedUser;
import nl.hackyourfuture.dojoserver.picture.PictureResponses;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import nl.hackyourfuture.dojoserver.volunteer.dto.VolunteerPictureResponse;
import nl.hackyourfuture.dojoserver.volunteer.dto.VolunteerRequest;
import nl.hackyourfuture.dojoserver.volunteer.dto.VolunteerResponse;
import nl.hackyourfuture.dojoserver.volunteer.dto.VolunteerSummaryResponse;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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
@RequestMapping("/api/volunteers")
@RequiredArgsConstructor
@Tag(name = "Volunteers", description = "Operations on volunteer profiles")
public class VolunteerController {
    private final VolunteerService volunteerService;

    @GetMapping
    @Operation(summary = "List volunteers",
            description = "Returns a page of volunteer summaries, ordered by first name.")
    @ApiResponse(responseCode = "200", description = "The page of volunteer summaries")
    @ApiResponse(
            responseCode = "400",
            description = "A request parameter is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public Page<VolunteerSummaryResponse> getVolunteers(
            @Parameter(description = "The direction to order the first names in")
            @RequestParam(defaultValue = "ASC")
            Sort.Direction direction,

            @Parameter(description = "Zero-based index of the page to fetch", example = "0")
            @RequestParam(defaultValue = "0")
            @Min(0)
            int page,

            @Parameter(description = "Number of volunteers per page", example = "25")
            @RequestParam(defaultValue = "25")
            @Min(1)
            @Max(100)
            int size
    ) {
        return volunteerService.getVolunteers(direction, page, size);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get volunteer", description = "Returns the profile of a specific volunteer")
    @ApiResponse(responseCode = "200", description = "The profile of a specific volunteer")
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public VolunteerResponse getVolunteer(
            @Parameter(description = "ID of the volunteer to fetch", example = "Vq7mKp2XaB")
            @PathVariable
            String id
    ) {
        return volunteerService.getVolunteer(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new volunteer",
            description = "Creates a new volunteer profile and returns it with its generated id.")
    @ApiResponse(responseCode = "201", description = "The volunteer was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "409",
            description = "The email address is already in use by another volunteer",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public VolunteerResponse createVolunteer(
            @AuthenticationPrincipal
            AuthenticatedUser currentUser,
            @Valid @RequestBody
            VolunteerRequest request
    ) {
        return volunteerService.createVolunteer(currentUser, request);
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update an existing volunteer",
            description = "Updates the volunteer with the given id. Send only the fields you want to change.")
    @io.swagger.v3.oas.annotations.parameters.RequestBody(
            description = "The fields to change. Every field is optional here, including the ones the schema marks as required.",
            content = @Content(schema = @Schema(implementation = VolunteerRequest.class))
    )
    @ApiResponse(responseCode = "200", description = "The updated volunteer")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid, or carries no fields at all",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "409",
            description = "The email address is already in use by another volunteer",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public VolunteerResponse updateVolunteer(
            @AuthenticationPrincipal
            AuthenticatedUser currentUser,
            @Parameter(description = "ID of the volunteer to update", example = "Vq7mKp2XaB")
            @PathVariable
            String id,
            @RequestBody
            ObjectNode patch
    ) {
        return volunteerService.updateVolunteer(currentUser, id, patch);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing volunteer",
            description = "Permanently deletes the volunteer profile and its picture.")
    @ApiResponse(responseCode = "204", description = "The volunteer has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteVolunteer(
            @AuthenticationPrincipal
            AuthenticatedUser currentUser,
            @Parameter(description = "ID of the volunteer to delete", example = "Vq7mKp2XaB")
            @PathVariable
            String id
    ) {
        volunteerService.deleteVolunteer(currentUser, id);
    }

    // Profile picture methods:
    @GetMapping("/{volunteerId}/picture/{pictureId}")
    @Operation(summary = "Get volunteer picture", description = "Returns the profile picture of a volunteer.")
    @ApiResponse(
            responseCode = "200",
            description = "The picture file",
            content = @Content(mediaType = "image/jpeg", schema = @Schema(type = "string", format = "binary"))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found, or the picture id is not the volunteer's current picture",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public ResponseEntity<InputStreamResource> getPicture(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        return PictureResponses.of(volunteerService.getPicture(volunteerId, pictureId));
    }

    @GetMapping("/{volunteerId}/picture/{pictureId}/thumbnail")
    @Operation(summary = "Get volunteer picture thumbnail",
            description = "Returns a smaller version of the profile picture of a volunteer.")
    @ApiResponse(
            responseCode = "200",
            description = "The thumbnail file",
            content = @Content(mediaType = "image/jpeg", schema = @Schema(type = "string", format = "binary"))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found, or the picture id is not the volunteer's current picture",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public ResponseEntity<InputStreamResource> getThumbnail(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        return PictureResponses.of(volunteerService.getThumbnail(volunteerId, pictureId));
    }

    @PutMapping(path = "/{id}/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Set volunteer picture",
            description = "Uploads a JPEG, PNG, GIF, BMP, TIFF or WebP image as the profile picture of a volunteer, replacing the current one.")
    @ApiResponse(responseCode = "200", description = "The URLs of the new picture and its thumbnail")
    @ApiResponse(
            responseCode = "400",
            description = "The picture is missing, empty, or not a JPEG, PNG, GIF, BMP, TIFF or WebP image",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "413",
            description = "The picture is too large",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public VolunteerPictureResponse setPicture(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String id,

            @Parameter(description = "The picture file: a JPEG, PNG, GIF, BMP, TIFF or WebP image")
            @RequestParam("picture")
            MultipartFile file
    ) {
        return volunteerService.setPicture(id, file);
    }

    @DeleteMapping("/{volunteerId}/picture/{pictureId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete volunteer picture",
            description = "Deletes the profile picture of a volunteer, together with its thumbnail.")
    @ApiResponse(responseCode = "204", description = "The profile picture has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The volunteer id was not found, or the picture id is not the volunteer's current picture",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deletePicture(
            @Parameter(description = "ID of the volunteer", example = "Vq7mKp2XaB")
            @PathVariable
            String volunteerId,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        volunteerService.deletePicture(volunteerId, pictureId);
    }
}
