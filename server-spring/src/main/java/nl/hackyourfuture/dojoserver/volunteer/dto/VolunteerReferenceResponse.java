package nl.hackyourfuture.dojoserver.volunteer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.volunteer.Volunteer;

@Schema(description = "A volunteer, as embedded in another record")
public record VolunteerReferenceResponse(
        @Schema(
                description = "Unique identifier of the volunteer",
                example = "Vq7mKp2XaB",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String id,

        @Schema(
                description = "The display name of the volunteer",
                example = "Jane Roe",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String name,

        @Schema(
                description = "Helper for the client to build a unique path to use in client routing.",
                example = "/volunteer/jane-roe_Vq7mKp2XaB",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String profilePath,

        @Schema(
                description = "The URL to a smaller version of the volunteer profile picture",
                example = "/api/volunteers/VOLUNTEERID/picture/PICTUREID/thumbnail",
                requiredMode = Schema.RequiredMode.REQUIRED,
                nullable = true
        )
        String thumbnailUrl
) {
    public static VolunteerReferenceResponse from(Volunteer volunteer) {
        return new VolunteerReferenceResponse(
                volunteer.getId(),
                volunteer.getDisplayName(),
                volunteer.getProfilePath(),
                volunteer.getThumbnailUrl());
    }
}
