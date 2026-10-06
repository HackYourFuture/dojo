package nl.hackyourfuture.dojoserver.search.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.partner.contactperson.ContactPerson;
import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.volunteer.Volunteer;

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
                description = "The main line to show, such as the record's name",
                example = "John Doe",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String title,

        @Schema(
                description = "A second line to show, with context about the record",
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
                description = "The client route that opens the record, or the record it belongs to if it has no page",
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

    public static SearchResult from(Volunteer volunteer, double score) {
        return new SearchResult(
                SearchResultType.VOLUNTEER,
                volunteer.getId(),
                volunteer.getDisplayName(),
                "Volunteer",
                volunteer.getThumbnailUrl(),
                volunteer.getProfilePath(),
                score);
    }

    public static SearchResult from(Organisation organisation, double score) {
        return new SearchResult(
                SearchResultType.ORGANISATION,
                organisation.getId(),
                organisation.getName(),
                "Organisation",
                organisation.getThumbnailUrl(),
                organisation.getProfilePath(),
                score);
    }

    // Contact persons have no page of their own, so the result opens their organisation.
    public static SearchResult from(ContactPerson contactPerson, Organisation organisation, double score) {
        return new SearchResult(
                SearchResultType.CONTACT_PERSON,
                contactPerson.getId(),
                contactPerson.getName(),
                organisation.getName(),
                null,
                organisation.getProfilePath(),
                score);
    }
}
