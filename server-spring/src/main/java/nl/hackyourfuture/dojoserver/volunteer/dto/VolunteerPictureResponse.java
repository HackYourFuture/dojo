package nl.hackyourfuture.dojoserver.volunteer.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.volunteer.Volunteer;

public record VolunteerPictureResponse(
        @Schema(
                description = "The URL to the volunteer profile picture",
                example = "/api/volunteers/VOLUNTEERID/picture/PICTUREID",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String pictureUrl,

        @Schema(
                description = "The URL to a smaller version of the volunteer profile picture",
                example = "/api/volunteers/VOLUNTEERID/picture/PICTUREID/thumbnail",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String thumbnailUrl
) {
    public static VolunteerPictureResponse from(Volunteer volunteer) {
        return new VolunteerPictureResponse(volunteer.getPictureUrl(), volunteer.getThumbnailUrl());
    }
}
