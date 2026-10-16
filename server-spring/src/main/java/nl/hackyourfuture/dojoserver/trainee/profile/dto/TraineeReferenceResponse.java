package nl.hackyourfuture.dojoserver.trainee.profile.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;

@Schema(description = "A trainee, as embedded in another record")
public record TraineeReferenceResponse(
        @Schema(
                description = "Unique identifier of the trainee",
                example = "c9JoIbbD4x",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String id,

        @Schema(
                description = "The display name of the trainee",
                example = "John Doe",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String name,

        @Schema(
                description = "Helper for the client to build a unique path to use in client routing.",
                example = "/trainee/john-doe_c9JoIbbD4x",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String profilePath,

        @Schema(
                description = "The URL to a smaller version of the trainee profile picture",
                example = "/api/trainees/TRAINEEID/picture/PICTUREID/thumbnail",
                requiredMode = Schema.RequiredMode.REQUIRED,
                nullable = true
        )
        String thumbnailUrl
) {
    public static TraineeReferenceResponse from(Trainee trainee) {
        return new TraineeReferenceResponse(
                trainee.getId(),
                trainee.getDisplayName(),
                trainee.getProfilePath(),
                trainee.getThumbnailUrl());
    }
}
