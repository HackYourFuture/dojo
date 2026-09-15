package nl.hackyourfuture.dojoserver.auth.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.admin.user.User;

@Schema(description = "The currently signed-in user")
public record SessionResponse(
        @Schema(
                description = "Unique identifier of the user",
                example = "WTh1qLhy3K",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String userId,

        @Schema(
                description = "The user Email.",
                example = "user@example.com",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String email,

        @Schema(
                description = "The display name of the user",
                example = "John Doe",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String name,

        @Schema(
                description = "The URL to the user image",
                example = "https://example.org/profile.jpg",
                requiredMode = Schema.RequiredMode.REQUIRED,
                nullable = true
        )
        String imageUrl
) {
    public static SessionResponse from(User user) {
        return new SessionResponse(user.getId(), user.getEmail(), user.getName(), user.getImageUrl());
    }
}
