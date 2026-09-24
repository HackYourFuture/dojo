package nl.hackyourfuture.dojoserver.admin.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.admin.user.User;

public record UserPictureResponse(
        @Schema(
                description = "The URL to the user picture",
                example = "/api/admin/users/USERID/picture/PICTUREID",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String pictureUrl,

        @Schema(
                description = "The URL to a smaller version of the user picture",
                example = "/api/admin/users/USERID/picture/PICTUREID/thumbnail",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String thumbnailUrl
) {
    public static UserPictureResponse from(User user) {
        return new UserPictureResponse(user.getPictureUrl(), user.getThumbnailUrl());
    }
}
