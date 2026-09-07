package nl.hackyourfuture.dojoserver.admin.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserRequest;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserResponse;
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
    public void deleteUser(
            @Parameter(
                    description = "ID of the user to delete",
                    example = "WTh1qLhy3K")
            @PathVariable
            String id) {
        userService.deleteUser(id);
    }
}
