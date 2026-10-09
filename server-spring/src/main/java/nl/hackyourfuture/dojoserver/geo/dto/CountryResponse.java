package nl.hackyourfuture.dojoserver.geo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import nl.hackyourfuture.dojoserver.geo.Country;

import java.util.List;

@Schema(description = "A country")
public record CountryResponse(
        @Schema(
                description = "ISO 3166-1 alpha-2 code, or a user-assigned code such as XK for Kosovo",
                example = "NL",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String id,

        @Schema(
                description = "The English name of the country",
                example = "Netherlands",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String name,

        @Schema(
                description = "Other names the country is known by, in English or Dutch. Often empty",
                example = "[\"Nederland\", \"Holland\", \"The Netherlands\"]",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        List<String> alternativeNames,

        @Schema(
                description = "A rough number of inhabitants, 0 when unknown",
                example = "17231017",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        int population,

        @Schema(
                description = "The flag as an emoji",
                example = "🇳🇱",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String flag,

        @Schema(
                description = "The country code, the same as the id",
                example = "NL",
                requiredMode = Schema.RequiredMode.REQUIRED
        )
        String code
) {
    public static CountryResponse from(Country country) {
        return new CountryResponse(country.getId(), country.getName(), country.getAlternativeNames(),
                country.getPopulation(), country.getFlag(), country.getCode());
    }
}
