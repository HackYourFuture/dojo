package nl.hackyourfuture.dojoserver.trainee.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record TraineePictureResponse(
        @Schema(
                description = "The URL to the trainee profile picture",
                example = "/api/trainees/TRAINEEID/picture/PICTUREID",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String pictureUrl,

        @Schema(
                description = "The URL to a smaller version of the trainee profile picture",
                example = "/api/trainees/TRAINEEID/picture/PICTUREID/thumbnail",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String thumbnailUrl
) {
}
