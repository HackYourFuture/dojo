package nl.hackyourfuture.dojoserver.partner.organisation.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;

public record OrganisationPictureResponse(
        @Schema(
                description = "The URL to the organisation's logo",
                example = "/api/organisations/ORGANISATIONID/picture/PICTUREID",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String pictureUrl,

        @Schema(
                description = "The URL to a smaller version of the organisation's logo",
                example = "/api/organisations/ORGANISATIONID/picture/PICTUREID/thumbnail",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String thumbnailUrl
) {
    public static OrganisationPictureResponse from(Organisation organisation) {
        return new OrganisationPictureResponse(organisation.getPictureUrl(), organisation.getThumbnailUrl());
    }
}
