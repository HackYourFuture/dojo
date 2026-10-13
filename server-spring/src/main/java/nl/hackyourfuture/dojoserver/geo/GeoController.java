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
@Tag(name = "Geo", description = "City and country information")
public class GeoController {
    private final GeoService geoService;

    @GetMapping("/cities")
    @Operation(summary = "List cities",
            description = "Returns cities in The Netherlands. With a query, up to 20 whose name or alternative name" +
                    " matches it, best match first; without one, every city by name.")
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

            @Parameter(description = "The most results to return: 20 with a query, otherwise all.", example = "10")
            @RequestParam(required = false)
            @Min(1)
            Integer limit
    ) {
        return geoService.getCities(q, limit);
    }

    @GetMapping("/countries")
    @Operation(summary = "List countries",
            description = "Returns countries. With a query, up to 20 whose name or alternative name matches it, best" +
                    " match first; without one, every country by name.")
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

            @Parameter(description = "The most results to return: 20 with a query, otherwise all.", example = "10")
            @RequestParam(required = false)
            @Min(1)
            Integer limit
    ) {
        return geoService.getCountries(q, limit);
    }
}
