package nl.hackyourfuture.dojoserver.geo;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.geo.dto.CityResponse;
import nl.hackyourfuture.dojoserver.geo.dto.CountryResponse;
import nl.hackyourfuture.dojoserver.shared.Hit;
import nl.hackyourfuture.dojoserver.shared.SearchText;
import nl.hackyourfuture.dojoserver.shared.TextMatcher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GeoService {
    private static final int DEFAULT_LIMIT = 20;
    // Equal matches go biggest first; the id keeps the order stable, since some have population 0.
    private static final Comparator<Place> BIGGEST_FIRST = Comparator
            .comparingInt(Place::getPopulation)
            .reversed()
            .thenComparing(Place::getId);

    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;

    @Transactional(readOnly = true)
    public List<CityResponse> getCities(String query, Integer limit) {
        List<City> allCities = cityRepository.findAll();
        return find(allCities, query, limit)
                .stream()
                .map(CityResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CountryResponse> getCountries(String query, Integer limit) {
        List<Country> allCountries = countryRepository.findAll();
        return find(allCountries, query, limit)
                .stream()
                .map(CountryResponse::from)
                .toList();
    }

    // Without a query every place by name. With one, the best matches of any of their names, biggest first when equal.
    static <T extends Place> List<T> find(List<T> places, String query, Integer limit) {
        if (query == null) {
            // Each plain name is worked out once, not on every comparison.
            Map<T, String> plainNames = places.stream()
                    .collect(Collectors.toMap(Function.identity(), place -> SearchText.plain(place.getName())));
            return places.stream()
                    .sorted(Comparator.comparing(plainNames::get))
                    .limit(limit != null ? limit : places.size())
                    .toList();
        }
        if (SearchText.isTooShort(query)) {
            return List.of();
        }
        return Hit.rank(places, place -> score(place, query), BIGGEST_FIRST)
                .stream()
                .map(Hit::item)
                .limit(limit != null ? limit : DEFAULT_LIMIT)
                .toList();
    }

    // The best match among the name and the alternative names, which count the same.
    private static double score(Place place, String query) {
        return place.names().stream().mapToDouble(name -> TextMatcher.score(name, query)).max().orElse(0);
    }
}
