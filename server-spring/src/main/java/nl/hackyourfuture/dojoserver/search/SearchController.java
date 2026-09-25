package nl.hackyourfuture.dojoserver.search;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.Size;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.search.dto.SearchResult;
import nl.hackyourfuture.dojoserver.shared.DojoError;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@Tag(name = "Search", description = "Find records by name and other details")
public class SearchController {
    private final SearchService searchService;

    @GetMapping
    @Operation(summary = "Search",
            description = "Returns up to 20 records that match every word of the query, best match first" +
                    ". A query shorter than two characters returns nothing.")
    @ApiResponse(responseCode = "200", description = "The matching records, best match first")
    @ApiResponse(
            responseCode = "400",
            description = "The query is missing or longer than 100 characters",
            content = @Content(schema = @Schema(implementation = DojoError.class))
    )
    public List<SearchResult> search(
            @Parameter(description = "The words to look for", example = "mariam h")
            @RequestParam
            @Size(max = 100)
            String q
    ) {
        return searchService.search(q);
    }
}
