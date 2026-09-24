package nl.hackyourfuture.dojoserver.trainee.profile;

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
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineePictureResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeRequest;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeSummaryResponse;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Sort;
import org.springframework.http.CacheControl;
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

import java.time.Duration;

@RestController
@RequestMapping("/api/trainees")
@RequiredArgsConstructor
@Tag(name = "Trainees", description = "Operations on trainee profiles")
public class TraineeController {
    private static final CacheControl PICTURE_CACHE =
            CacheControl.maxAge(Duration.ofDays(365)).cachePrivate().immutable();

    private final TraineeService traineeService;

    @GetMapping
    @Operation(summary = "List trainees",
            description = "Returns a page of trainee summaries, ordered by the current cohort. ")
    @ApiResponse(responseCode = "200", description = "The page of trainee summaries")
    @ApiResponse(
            responseCode = "400",
            description = "A request parameter is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public Page<TraineeSummaryResponse> getTrainees(
            @Parameter(
                    description = "Only trainees whose current cohort is this one or later",
                    example = "0")
            @RequestParam(required = false)
            Integer startCohort,

            @Parameter(
                    description = "Only trainees whose current cohort is this one or earlier",
                    example = "99")
            @RequestParam(required = false)
            Integer endCohort,

            @Parameter(description = "The direction to order the cohorts in")
            @RequestParam(defaultValue = "ASC")
            Sort.Direction direction,

            @Parameter(description = "Zero-based index of the page to fetch", example = "0")
            @RequestParam(defaultValue = "0")
            @Min(0)
            int page,

            @Parameter(description = "Number of trainees per page", example = "25")
            @RequestParam(defaultValue = "25")
            @Min(1)
            @Max(100)
            int size
    ) {
        return traineeService.getTrainees(startCohort, endCohort, direction, page, size);
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
    public TraineeResponse createTrainee(
            @AuthenticationPrincipal
            AuthenticatedUser currentUser,
            @Valid @RequestBody
            TraineeRequest request) {
        return traineeService.createTrainee(currentUser, request);
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
            @AuthenticationPrincipal
            AuthenticatedUser currentUser,
            @Parameter(
                    description = "ID of the trainee to update",
                    example = "HpOjvmwXsL")
            @PathVariable
            String id,
            @RequestBody
            ObjectNode patch) {
        return traineeService.updateTrainee(currentUser, id, patch);
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
            @AuthenticationPrincipal
            AuthenticatedUser currentUser,
            @Parameter(description = "ID of the trainee to delete", example = "TRAINEEID")
            @PathVariable
            String id) {
        traineeService.deleteTrainee(currentUser, id);
    }

    // Profile picture methods:
    @GetMapping("/{traineeId}/picture/{pictureId}")
    @Operation(summary = "Get trainee picture", description = "Returns the profile picture of a trainee.")
    @ApiResponse(
            responseCode = "200",
            description = "The picture file",
            content = @Content(mediaType = "image/jpeg", schema = @Schema(type = "string", format = "binary"))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id was not found, or the picture id is not the trainee's current picture",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public ResponseEntity<InputStreamResource> getPicture(
            @Parameter(description = "ID of the trainee", example = "TRAINEEID")
            @PathVariable
            String traineeId,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        StoredFile picture = traineeService.getPicture(traineeId, pictureId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(picture.contentType()))
                .contentLength(picture.contentLength())
                .cacheControl(PICTURE_CACHE)
                .body(new InputStreamResource(picture.content()));
    }

    @GetMapping("/{traineeId}/picture/{pictureId}/thumbnail")
    @Operation(summary = "Get trainee picture thumbnail",
            description = "Returns a smaller version of the profile picture of a trainee.")
    @ApiResponse(
            responseCode = "200",
            description = "The thumbnail file",
            content = @Content(mediaType = "image/jpeg", schema = @Schema(type = "string", format = "binary"))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id was not found, or the picture id is not the trainee's current picture",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public ResponseEntity<InputStreamResource> getThumbnail(
            @Parameter(description = "ID of the trainee", example = "TRAINEEID")
            @PathVariable
            String traineeId,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        StoredFile picture = traineeService.getThumbnail(traineeId, pictureId);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(picture.contentType()))
                .contentLength(picture.contentLength())
                .cacheControl(PICTURE_CACHE)
                .body(new InputStreamResource(picture.content()));
    }

    @PutMapping(path = "/{id}/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Set trainee picture",
            description = "Uploads a JPEG, PNG, GIF, BMP, TIFF or WebP image as the profile picture of a trainee, replacing the current one.")
    @ApiResponse(responseCode = "200", description = "The URLs of the new picture and its thumbnail")
    @ApiResponse(
            responseCode = "400",
            description = "The picture is missing, empty, or not a JPEG, PNG, GIF, BMP, TIFF or WebP image",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "413",
            description = "The picture is too large",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public TraineePictureResponse setPicture(
            @Parameter(description = "ID of the trainee", example = "TRAINEEID")
            @PathVariable
            String id,

            @Parameter(description = "The picture file: a JPEG, PNG, GIF, BMP, TIFF or WebP image")
            @RequestParam("picture")
            MultipartFile file
    ) {
        return traineeService.setPicture(id, file);
    }

    @DeleteMapping("/{traineeId}/picture/{pictureId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete trainee picture",
            description = "Deletes the profile picture of a trainee, together with its thumbnail.")
    @ApiResponse(responseCode = "204", description = "The profile picture has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The trainee id was not found, or the picture id is not the trainee's current picture",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deletePicture(
            @Parameter(description = "ID of the trainee", example = "TRAINEEID")
            @PathVariable
            String traineeId,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        this.traineeService.deletePicture(traineeId, pictureId);
    }
}
