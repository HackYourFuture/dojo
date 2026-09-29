package nl.hackyourfuture.dojoserver.partner.contactperson.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

import java.util.Locale;

@Schema(description = "A contact person at a partner organisation, as sent to create or update one")
public record ContactPersonRequest(
        @NotBlank
        @Size(min = 2, max = 100)
        @Schema(description = "The full name of the contact person.", example = "Jane Roe")
        String name,

        @Size(min = 3, max = 100)
        @Email
        @Schema(description = "The email address of the contact person.", example = "jane.roe@example.com")
        String email,

        @Size(min = 5, max = 30)
        @Schema(description = "A phone number the contact person can be reached on.", example = "+31612345678")
        String phone,

        @Size(min = 5, max = 200)
        @URL
        @Schema(description = "The URL to the contact person's LinkedIn profile.",
                example = "https://linkedin.com/in/jane-roe")
        String linkedinUrl,

        @Size(min = 2, max = 100)
        @Schema(description = "The role of the contact person at the organisation.",
                example = "Talent Acquisition Lead")
        String jobTitle,

        @Size(max = 5000)
        @Schema(description = "Free-form notes about the contact person.")
        String notes
) {

    public ContactPersonRequest {
        name = name == null ? null : name.strip();
        email = email == null ? null : email.strip().toLowerCase(Locale.ROOT);
        phone = phone == null ? null : phone.strip();
        linkedinUrl = linkedinUrl == null ? null : linkedinUrl.strip();
        jobTitle = jobTitle == null ? null : jobTitle.strip();
        notes = notes == null ? null : notes.strip();
    }
}
