package nl.hackyourfuture.dojoserver.admin.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserPictureResponse;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserRequest;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserResponse;
import nl.hackyourfuture.dojoserver.picture.PictureResponses;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Operations on user accounts")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "List all users", description = "Returns all users in Dojo.")
    @ApiResponse(responseCode = "200", description = "The list of users")
    public List<UserResponse> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user", description = "Returns details about a specific user")
    @ApiResponse(responseCode = "200", description = "Details about a specific user")
    @ApiResponse(
            responseCode = "404",
            description = "The user id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public UserResponse getUser(
            @Parameter(description = "ID of the user to fetch", example = "WTh1qLhy3K")
            @PathVariable
            String id
    ) {
        return userService.getUser(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Create a new user",
            description = "Creates a new user account and returns it with its generated id.")
    @ApiResponse(responseCode = "201", description = "The user was created")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "409",
            description = "The email address is already in use by another user.",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public UserResponse createUser(
            @Valid @RequestBody
            UserRequest request) {
        return userService.createUser(request);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Update an existing user", description = "Replaces the details of the user with the given id.")
    @ApiResponse(responseCode = "200", description = "The updated user")
    @ApiResponse(
            responseCode = "400",
            description = "The request body is invalid",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The user id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "409",
            description = "The email address is already in use by another user.",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public UserResponse updateUser(
            @Parameter(
                    description = "ID of the user to update",
                    example = "WTh1qLhy3K")
            @PathVariable
            String id,
            @Valid @RequestBody
            UserRequest request) {
        return userService.updateUser(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete an existing user", description = "Permanently deletes the user from the system.")
    @ApiResponse(responseCode = "204", description = "The user has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The user id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "409",
            description = "The user reported interactions, which have to keep their author.",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deleteUser(
            @Parameter(
                    description = "ID of the user to delete",
                    example = "WTh1qLhy3K")
            @PathVariable
            String id) {
        userService.deleteUser(id);
    }

    // Profile picture methods:
    @GetMapping("/{id}/picture/{pictureId}")
    @Operation(summary = "Get user picture", description = "Returns the profile picture of a user.")
    @ApiResponse(
            responseCode = "200",
            description = "The picture file",
            content = @Content(mediaType = "image/jpeg", schema = @Schema(type = "string", format = "binary"))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The user id was not found, or the picture id is not the user's current picture",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public ResponseEntity<InputStreamResource> getPicture(
            @Parameter(description = "ID of the user", example = "WTh1qLhy3K")
            @PathVariable
            String id,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        return PictureResponses.of(userService.getPicture(id, pictureId));
    }

    @GetMapping("/{id}/picture/{pictureId}/thumbnail")
    @Operation(summary = "Get user picture thumbnail",
            description = "Returns a smaller version of the profile picture of a user.")
    @ApiResponse(
            responseCode = "200",
            description = "The thumbnail file",
            content = @Content(mediaType = "image/jpeg", schema = @Schema(type = "string", format = "binary"))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The user id was not found, or the picture id is not the user's current picture",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public ResponseEntity<InputStreamResource> getThumbnail(
            @Parameter(description = "ID of the user", example = "WTh1qLhy3K")
            @PathVariable
            String id,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        return PictureResponses.of(userService.getThumbnail(id, pictureId));
    }

    @PutMapping(path = "/{id}/picture", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Set user picture",
            description = "Uploads a JPEG, PNG, GIF, BMP, TIFF or WebP image as the profile picture of a user, replacing the current one.")
    @ApiResponse(responseCode = "200", description = "The URLs of the new picture and its thumbnail")
    @ApiResponse(
            responseCode = "400",
            description = "The picture is missing, empty, or not a JPEG, PNG, GIF, BMP, TIFF or WebP image",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "404",
            description = "The user id was not found",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    @ApiResponse(
            responseCode = "413",
            description = "The picture is too large",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public UserPictureResponse setPicture(
            @Parameter(description = "ID of the user", example = "WTh1qLhy3K")
            @PathVariable
            String id,

            @Parameter(description = "The picture file: a JPEG, PNG, GIF, BMP, TIFF or WebP image")
            @RequestParam("picture")
            MultipartFile file
    ) {
        return userService.setPicture(id, file);
    }

    @DeleteMapping("/{id}/picture/{pictureId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Delete user picture",
            description = "Deletes the profile picture of a user, together with its thumbnail.")
    @ApiResponse(responseCode = "204", description = "The profile picture has been successfully deleted")
    @ApiResponse(
            responseCode = "404",
            description = "The user id was not found, or the picture id is not the user's current picture",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public void deletePicture(
            @Parameter(description = "ID of the user", example = "WTh1qLhy3K")
            @PathVariable
            String id,

            @Parameter(description = "ID of the picture", example = "PICTUREID")
            @PathVariable
            String pictureId
    ) {
        userService.deletePicture(id, pictureId);
    }
}
