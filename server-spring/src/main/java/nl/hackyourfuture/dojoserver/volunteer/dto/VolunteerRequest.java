package nl.hackyourfuture.dojoserver.volunteer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import nl.hackyourfuture.dojoserver.shared.model.Gender;
import nl.hackyourfuture.dojoserver.volunteer.Volunteer;
import nl.hackyourfuture.dojoserver.volunteer.VolunteerStatus;
import org.hibernate.validator.constraints.URL;

import java.util.Locale;

@Schema(description = "The details of a volunteer profile, as sent to create or update one")
public record VolunteerRequest(
        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "The first name of the volunteer.", example = "Jane")
        String firstName,

        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "The last name of the volunteer.", example = "Roe")
        String lastName,

        @Schema(description = "How the volunteer describes their gender.", example = "woman")
        Gender gender,

        @Size(min = 2, max = 100)
        @Schema(description = "The pronouns the volunteer goes by.", example = "She/her")
        String pronouns,

        @Size(min = 2, max = 200)
        @Schema(description = "The company the volunteer works for.", example = "Acme B.V.")
        String companyName,

        @Size(min = 2, max = 100)
        @Schema(description = "The volunteer's job role at their company.", example = "Senior Developer")
        String jobRole,

        @NotBlank
        @Size(min = 3, max = 100)
        @Email
        @Schema(description = "The volunteer's email address. Must be unique across all volunteers.",
                example = "jane.roe@example.com")
        String email,

        @Size(min = 5, max = 30)
        @Schema(description = "A phone number the volunteer can be reached on.", example = "+31612345678")
        String phone,

        @Size(min = 2, max = 50)
        @Schema(description = "The volunteer's GitHub username, without the URL.", example = "janeroe")
        String githubHandle,

        @Size(min = 6, max = 50)
        @Schema(description = "The volunteer's Slack member id.", example = "U068AQ9G99F")
        String slackId,

        @Size(min = 5, max = 200)
        @URL
        @Schema(description = "The URL to the volunteer's LinkedIn profile.",
                example = "https://linkedin.com/in/jane-roe")
        String linkedinUrl,

        @NotNull
        @Schema(description = "Where the volunteer stands with HackYourFuture.", example = "active")
        VolunteerStatus status,

        @Size(max = 5000)
        @Schema(description = "Free-form notes about the volunteer.")
        String notes
) {

    public VolunteerRequest {
        firstName = firstName == null ? null : firstName.strip();
        lastName = lastName == null ? null : lastName.strip();
        pronouns = pronouns == null ? null : pronouns.strip();
        companyName = companyName == null ? null : companyName.strip();
        jobRole = jobRole == null ? null : jobRole.strip();
        email = email == null ? null : email.strip().toLowerCase(Locale.ROOT);
        phone = phone == null ? null : phone.strip();
        githubHandle = githubHandle == null ? null : githubHandle.strip();
        slackId = slackId == null ? null : slackId.strip();
        linkedinUrl = linkedinUrl == null ? null : linkedinUrl.strip();
        notes = notes == null ? null : notes.strip();
    }

    public static VolunteerRequest from(Volunteer volunteer) {
        return new VolunteerRequest(
                volunteer.getFirstName(),
                volunteer.getLastName(),
                volunteer.getGender(),
                volunteer.getPronouns(),
                volunteer.getCompanyName(),
                volunteer.getJobRole(),
                volunteer.getEmail(),
                volunteer.getPhone(),
                volunteer.getGithubHandle(),
                volunteer.getSlackId(),
                volunteer.getLinkedinUrl(),
                volunteer.getStatus(),
                volunteer.getNotes());
    }
}
