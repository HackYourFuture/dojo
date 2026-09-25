package nl.hackyourfuture.dojoserver.search;

import nl.hackyourfuture.dojoserver.search.dto.SearchResult;
import nl.hackyourfuture.dojoserver.search.dto.SearchResultType;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SearchService {

    // Placeholder until the ranking lands: always the same made-up trainee, whatever the query.
    public List<SearchResult> search(String query) {
        return List.of(new SearchResult(SearchResultType.TRAINEE, "TRAINEEID", "John Doe", "Cohort 53", null,
                "/trainee/john-doe_TRAINEEID", 5000));
    }
}
