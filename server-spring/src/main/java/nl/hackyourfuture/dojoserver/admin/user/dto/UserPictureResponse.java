package nl.hackyourfuture.dojoserver.admin.user.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record UserPictureResponse(
        @Schema(
                description = "The URL to the user picture",
                example = "/api/admin/users/USERID/picture/PICTUREID",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String pictureUrl
) {
}
