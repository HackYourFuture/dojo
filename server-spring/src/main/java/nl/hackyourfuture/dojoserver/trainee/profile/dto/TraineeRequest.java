package nl.hackyourfuture.dojoserver.trainee.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import nl.hackyourfuture.dojoserver.trainee.profile.Gender;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;

@Schema(description = "The details of a trainee profile, as sent to create or update one")
public record TraineeRequest(
        @Size(min = 5, max = 200)
        @Schema(description = "The URL to the trainee profile picture",
                example = "https://example.org/profile.jpg")
        String imageUrl,

        @Size(min = 5, max = 200)
        @Schema(description = "The URL to a smaller version of the trainee profile picture",
                example = "https://example.org/profile_thumb.jpg")
        String thumbnailUrl,

        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "The legal first name of the trainee.", example = "John")
        String firstName,

        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "The legal last name of the trainee.", example = "Doe")
        String lastName,

        @Size(min = 2, max = 100)
        @Schema(description = "The name the trainee prefers to be called.", example = "Johnny")
        String preferredName,

        @NotBlank
        @Size(min = 3, max = 100)
        @Email
        @Schema(description = "The trainee Email. Must be unique across all trainees.",
                example = "john.doe@example.com")
        String email,

        @Schema(description = "How the trainee describes their gender.", example = "non-binary")
        Gender gender,

        @Size(min = 2, max = 100)
        @Schema(description = "The pronouns the trainee goes by. Free text, not a fixed list.",
                example = "They/them")
        String pronouns
) {

    public TraineeRequest {
        imageUrl = imageUrl == null ? null : imageUrl.strip();
        thumbnailUrl = thumbnailUrl == null ? null : thumbnailUrl.strip();
        firstName = firstName == null ? null : firstName.strip();
        lastName = lastName == null ? null : lastName.strip();
        preferredName = preferredName == null ? null : preferredName.strip();
        email = email == null ? null : email.strip().toLowerCase();
        pronouns = pronouns == null ? null : pronouns.strip();
    }

    /** The trainee as stored, which is what a PATCH body is merged on top of. */
    public static TraineeRequest from(Trainee trainee) {
        return new TraineeRequest(
                trainee.getImageUrl(),
                trainee.getThumbnailUrl(),
                trainee.getFirstName(),
                trainee.getLastName(),
                trainee.getPreferredName(),
                trainee.getEmail(),
                trainee.getGender(),
                trainee.getPronouns());
    }
}
