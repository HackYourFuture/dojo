package nl.hackyourfuture.dojoserver.geo;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.geo.dto.CityResponse;
import nl.hackyourfuture.dojoserver.geo.dto.CountryResponse;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/geo")
@RequiredArgsConstructor
@Tag(name = "Geo", description = "Countries and Dutch cities, for picking a place")
public class GeoController {
    private final GeoService geoService;

    @GetMapping("/cities")
    @Operation(summary = "List cities",
            description = "Without a query, returns every Dutch city, town and village by name. With a " +
                    "query, returns up to 20 places where every word matches the name or an alternative name: an " +
                    "exact name first, then names that start with the query, both biggest first, then the other " +
                    "matches, best first. A query shorter than two characters returns nothing. A limit changes how " +
                    "many are returned.")
    @ApiResponse(responseCode = "200", description = "The cities")
    @ApiResponse(
            responseCode = "400",
            description = "The query is longer than 100 characters, or the limit is not a whole number of at least 1",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public List<CityResponse> getCities(
            @Parameter(description = "The words to look for", example = "den haag")
            @RequestParam(required = false)
            @Size(max = 100)
            String q,

            @Parameter(description = "The most results to return. Without it, a query returns 20 and no " +
                    "query returns everything", example = "10")
            @RequestParam(required = false)
            @Min(1)
            Integer limit
    ) {
        return geoService.getCities(q, limit);
    }

    @GetMapping("/countries")
    @Operation(summary = "List countries",
            description = "Without a query, returns every country by name. With a query, returns up to 20 " +
                    "countries where every word matches the name or an alternative name: an exact name first, then " +
                    "names that start with the query, both biggest first, then the other matches, best first. A " +
                    "query shorter than two characters returns nothing. A limit changes how many are returned.")
    @ApiResponse(responseCode = "200", description = "The countries")
    @ApiResponse(
            responseCode = "400",
            description = "The query is longer than 100 characters, or the limit is not a whole number of at least 1",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public List<CountryResponse> getCountries(
            @Parameter(description = "The words to look for", example = "nether")
            @RequestParam(required = false)
            @Size(max = 100)
            String q,

            @Parameter(description = "The most results to return. Without it, a query returns 20 and no " +
                    "query returns everything", example = "10")
            @RequestParam(required = false)
            @Min(1)
            Integer limit
    ) {
        return geoService.getCountries(q, limit);
    }
}
