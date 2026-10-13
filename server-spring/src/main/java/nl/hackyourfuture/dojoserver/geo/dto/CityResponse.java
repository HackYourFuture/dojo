package nl.hackyourfuture.dojoserver.geo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.geo.City;

import java.util.List;

@Schema(description = "A Dutch city, town or village")
public record CityResponse(
        @Schema(
                description = "The unique ID",
                example = "hengelo-gelderland",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String id,

        @Schema(
                description = "The name of the place.",
                example = "Amsterdam",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String name,

        @Schema(
                description = "Other names the place is known by",
                example = "[\"Den Haag\", \"'s-Gravenhage\"]",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        List<String> alternativeNames,

        @Schema(
                description = "A rough number of inhabitants, 0 when unknown",
                example = "4510",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        int population,

        @Schema(
                description = "The English name of the province",
                example = "Gelderland",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String province,

        @Schema(
                description = "The labour market region (arbeidsmarktregio)",
                example = "Achterhoek",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String region,

        @Schema(description = "The location of the place", requiredMode = Schema.RequiredMode.REQUIRED)
        Coordinates coordinates,

        @Schema(
                description = "The driving distance from Amsterdam in km, null when there is no route",
                example = "132",
                requiredMode = Schema.RequiredMode.REQUIRED,
                nullable = true
        )
        Integer distanceAmsterdam
) {
    @Schema(description = "A position in decimal degrees")
    public record Coordinates(
            @Schema(description = "Latitude", example = "52.05083", requiredMode = Schema.RequiredMode.REQUIRED)
            double lat,

            @Schema(description = "Longitude", example = "6.30972", requiredMode = Schema.RequiredMode.REQUIRED)
            double lon
    ) {
    }

    public static CityResponse from(City city) {
        return new CityResponse(city.getId(), city.getName(), city.getAlternativeNames(), city.getPopulation(),
                city.getProvince(), city.getRegion(), new Coordinates(city.getLatitude(), city.getLongitude()),
                city.getDistanceAmsterdam());
    }
}
