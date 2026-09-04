package nl.hackyourfuture.dojoserver.admin.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "The details needed to create or update a user")
public record UserRequest(
        @NotBlank(message = "Please provide an email")
        @Size(min=3,max=100)
        @Email
        @Schema(description = "Email address of the user", example = "user@example.com")
        String email
) {}
