package nl.hackyourfuture.dojoserver.search.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;

@Schema(description = "A search result.")
public record SearchResult(
        @Schema(
                description = "The kind of the search result",
                example = "trainee",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        SearchResultType type,

        @Schema(
                description = "Unique identifier of the record",
                example = "UNIQUEID",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String id,

        @Schema(
                description = "The main line to show, such as a trainee's display name",
                example = "John Doe",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String title,

        @Schema(
                description = "A second line to show, such as a trainee's cohort",
                example = "Cohort 53",
                requiredMode = Schema.RequiredMode.REQUIRED,
                nullable = true
        )
        String subtitle,

        @Schema(
                description = "The URL of a small picture of the record",
                example = "/api/trainees/TRAINEEID/picture/PICTUREID/thumbnail",
                requiredMode = Schema.RequiredMode.REQUIRED,
                nullable = true
        )
        String thumbnailUrl,

        @Schema(
                description = "The client route that opens the record",
                example = "/trainee/john-doe_TRAINEEID",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String path,

        @Schema(
                description = "How well the record matches the query. Higher is better, and scores only compare "
                        + "within one search",
                example = "5000",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        double score
) {
    public static SearchResult from(Trainee trainee, double score) {
        Integer cohort = trainee.getCurrentCohort();
        return new SearchResult(
                SearchResultType.TRAINEE,
                trainee.getId(),
                trainee.getDisplayName(),
                cohort == null ? "No cohort assigned" : "Cohort " + cohort,
                trainee.getThumbnailUrl(),
                trainee.getProfilePath(),
                score);
    }
}
