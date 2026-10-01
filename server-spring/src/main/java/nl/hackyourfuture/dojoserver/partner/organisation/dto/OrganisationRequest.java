package nl.hackyourfuture.dojoserver.partner.organisation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;
import nl.hackyourfuture.dojoserver.partner.organisation.OrganisationStatus;
import nl.hackyourfuture.dojoserver.partner.organisation.PartnershipType;
import org.hibernate.validator.constraints.URL;

import java.util.List;
import java.util.Set;

@Schema(description = "The details of a partner organisation, as sent to create or update one")
public record OrganisationRequest(
        @NotBlank
        @Size(min = 2, max = 200)
        @Schema(description = "The name of the organisation.", example = "Acme B.V.")
        String name,

        @Size(min = 5, max = 200)
        @URL
        @Schema(description = "The URL to the organisation's website.", example = "https://example.com")
        String websiteUrl,

        @Size(min = 5, max = 200)
        @URL
        @Schema(description = "The URL to the organisation's LinkedIn page.",
                example = "https://linkedin.com/company/acme")
        String linkedinUrl,

        @Size(min = 2, max = 100)
        @Schema(description = "The city the organisation is based in.", example = "Amsterdam")
        String location,

        @NotNull
        @Schema(description = "Where the partnership with the organisation stands.", example = "active")
        OrganisationStatus status,

        @Size(max = 5000)
        @Schema(description = "Free-form notes about the organisation.")
        String notes,

        @Schema(description = "What the organisation can offer HYF.", example = "[\"funding\", \"events\"]")
        Set<PartnershipType> partnershipTypes,

        @Schema(description = "The ids of the users responsible for the organisation, the primary first.",
                example = "[\"WTh1qLhy3K\"]")
        List<@NotBlank String> responsibleIds
) {

    public OrganisationRequest {
        name = name == null ? null : name.strip();
        websiteUrl = websiteUrl == null ? null : websiteUrl.strip();
        linkedinUrl = linkedinUrl == null ? null : linkedinUrl.strip();
        location = location == null ? null : location.strip();
        notes = notes == null ? null : notes.strip();
        partnershipTypes = partnershipTypes == null ? Set.of() : partnershipTypes;
        // Not List.copyOf, which throws on a null id: a 500 instead of the validation 400.
        responsibleIds = responsibleIds == null ? List.of() : responsibleIds.stream().distinct().toList();
    }

    public static OrganisationRequest from(Organisation organisation) {
        return new OrganisationRequest(
                organisation.getName(),
                organisation.getWebsiteUrl(),
                organisation.getLinkedinUrl(),
                organisation.getLocation(),
                organisation.getStatus(),
                organisation.getNotes(),
                organisation.getPartnershipTypes(),
                organisation.getResponsibleIds());
    }
}
