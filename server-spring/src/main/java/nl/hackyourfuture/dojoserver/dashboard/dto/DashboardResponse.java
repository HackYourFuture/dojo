package nl.hackyourfuture.dojoserver.dashboard.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.trainee.profile.EducationLevel;
import nl.hackyourfuture.dojoserver.trainee.profile.Gender;
import nl.hackyourfuture.dojoserver.trainee.profile.LearningStatus;
import nl.hackyourfuture.dojoserver.trainee.profile.Track;

import java.util.List;

@Schema(description = "Trainee statistics for the dashboard.")
public record DashboardResponse(
        @Schema(description = "The headline numbers", requiredMode = Schema.RequiredMode.REQUIRED)
        Overview overview,

        @Schema(description = "Number of trainees per learning status, only statuses with trainees",
                requiredMode = Schema.RequiredMode.REQUIRED)
        List<StatusCount> learningStatuses,

        @Schema(description = "Number of trainees per track, only tracks with trainees",
                requiredMode = Schema.RequiredMode.REQUIRED)
        List<TrackCount> tracks,

        @Schema(description = "Number of trainees per education level, only levels with trainees",
                requiredMode = Schema.RequiredMode.REQUIRED)
        List<EducationLevelCount> educationLevels,

        @Schema(description = "Number of trainees per country of origin, largest first",
                requiredMode = Schema.RequiredMode.REQUIRED)
        List<CountryCount> countries,

        @Schema(description = "Number of trainees per gender, only genders with trainees",
                requiredMode = Schema.RequiredMode.REQUIRED)
        List<GenderCount> genders
) {
    public record Overview(
            @Schema(description = "Trainees with learning status studying", example = "20",
                    requiredMode = Schema.RequiredMode.REQUIRED)
            int studying,

            @Schema(description = "Trainees with learning status on hold", example = "5",
                    requiredMode = Schema.RequiredMode.REQUIRED)
            int onHold,

            @Schema(description = "Graduates with job path searching", example = "12",
                    requiredMode = Schema.RequiredMode.REQUIRED)
            int searching,

            @Schema(description = "Studying, on hold and searching together", example = "37",
                    requiredMode = Schema.RequiredMode.REQUIRED)
            int active,

            @Schema(description = "Graduates with job path internship or tech job", example = "40",
                    requiredMode = Schema.RequiredMode.REQUIRED)
            int workingInIt,

            @Schema(description = "Trainees who quit, plus graduates neither working in IT nor searching",
                    example = "15", requiredMode = Schema.RequiredMode.REQUIRED)
            int leftWithoutItJob,

            @Schema(description = "All trainees", example = "150", requiredMode = Schema.RequiredMode.REQUIRED)
            int total
    ) {
    }

    public record StatusCount(
            @Schema(description = "The learning status", example = "studying",
                    requiredMode = Schema.RequiredMode.REQUIRED)
            LearningStatus status,

            @Schema(description = "Number of trainees", example = "20", requiredMode = Schema.RequiredMode.REQUIRED)
            int count
    ) {
    }

    public record TrackCount(
            @Schema(description = "The track", example = "frontend", requiredMode = Schema.RequiredMode.REQUIRED)
            Track track,

            @Schema(description = "Number of trainees", example = "8", requiredMode = Schema.RequiredMode.REQUIRED)
            int count
    ) {
    }

    public record EducationLevelCount(
            @Schema(description = "The education level, null when not set", example = "bachelors-degree",
                    requiredMode = Schema.RequiredMode.REQUIRED, nullable = true)
            EducationLevel educationLevel,

            @Schema(description = "Number of trainees", example = "8", requiredMode = Schema.RequiredMode.REQUIRED)
            int count
    ) {
    }

    public record CountryCount(
            @Schema(description = "The country of origin, null when not set", example = "Syria",
                    requiredMode = Schema.RequiredMode.REQUIRED, nullable = true)
            String country,

            @Schema(description = "Number of trainees", example = "15", requiredMode = Schema.RequiredMode.REQUIRED)
            int count
    ) {
    }

    public record GenderCount(
            @Schema(description = "The gender, null when not set", example = "woman",
                    requiredMode = Schema.RequiredMode.REQUIRED, nullable = true)
            Gender gender,

            @Schema(description = "Number of trainees", example = "10", requiredMode = Schema.RequiredMode.REQUIRED)
            int count
    ) {
    }
}
