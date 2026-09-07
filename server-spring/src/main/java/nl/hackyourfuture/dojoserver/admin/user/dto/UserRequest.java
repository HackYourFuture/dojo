package nl.hackyourfuture.dojoserver.admin.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Schema(description = "The details needed to create or update a user")
public record UserRequest(
        @NotBlank
        @Size(min = 3, max = 100)
        @Email
        @Schema(description = "The user Email. Used for authentication.", example = "user@example.com")
        String email,

        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "The display name of the user.", example = "John Doe")
        String name,

        @Size(min = 5, max = 200)
        @Schema(description = "The URL to the user image", example = "https://example.org/profile.jpg")
        String imageUrl,

        @NotNull
        @Schema(description = "User active status. Non active users cannot log in.", example = "true")
        Boolean isActive
) {

    public UserRequest {
        email = email == null ? null : email.strip().toLowerCase();
        name = name == null ? null : name.strip();
        imageUrl = imageUrl == null ? null : imageUrl.strip();
    }
}
