package nl.hackyourfuture.dojoserver.geo;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.geo.dto.CityResponse;
import nl.hackyourfuture.dojoserver.geo.dto.CountryResponse;
import nl.hackyourfuture.dojoserver.shared.SearchMatcher;
import nl.hackyourfuture.dojoserver.shared.SearchMatcher.Field;
import nl.hackyourfuture.dojoserver.shared.SearchMatcher.Hit;
import nl.hackyourfuture.dojoserver.shared.SearchText;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class GeoService {
    // How many matches a query returns when the caller sets no limit.
    private static final int DEFAULT_LIMIT = 20;
    // Equal matches go biggest first; the id keeps the order stable, since some have population 0.
    private static final Comparator<City> CITY_ORDER = Comparator.comparingInt(City::getPopulation).reversed()
            .thenComparing(City::getId);
    private static final Comparator<Country> COUNTRY_ORDER = Comparator.comparingInt(Country::getPopulation)
            .reversed().thenComparing(Country::getId);

    private final CityRepository cityRepository;
    private final CountryRepository countryRepository;

    @Transactional(readOnly = true)
    public List<CityResponse> getCities(String query, Integer limit) {
        return rankCities(cityRepository.findAll(), query, limit).stream().map(CityResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public List<CountryResponse> getCountries(String query, Integer limit) {
        return rankCountries(countryRepository.findAll(), query, limit).stream().map(CountryResponse::from).toList();
    }

    static List<City> rankCities(List<City> cities, String query, Integer limit) {
        return find(cities, query, limit, city -> names(city.getName(), city.getAlternativeNames()), CITY_ORDER);
    }

    // Not the code: a code such as NE would beat Netherlands for "ne".
    static List<Country> rankCountries(List<Country> countries, String query, Integer limit) {
        return find(countries, query, limit, country -> names(country.getName(), country.getAlternativeNames()),
                COUNTRY_ORDER);
    }

    // The name and every alternative name, as plain words that count the same.
    private static List<String> names(String name, List<String> alternativeNames) {
        return Stream.concat(Stream.of(name), alternativeNames.stream()).map(GeoService::plain).toList();
    }

    // Without a query every item, by name. With one, the matches: a name typed in full or in part first, the biggest
    // before a smaller one, then the other matches by score. One letter finds nothing, as in global search.
    private static <T> List<T> find(List<T> items, String query, Integer limit, Function<T, List<String>> names,
            Comparator<T> order) {
        if (query == null) {
            // Each sort key is worked out once: comparing 2.5k cities would otherwise redo it some 50k times.
            record Named<U>(String key, U item) {
            }
            return items.stream()
                    .map(item -> new Named<>(names.apply(item).getFirst(), item))
                    .sorted(Comparator.comparing((Named<T> named) -> named.key()).thenComparing(Named::item, order))
                    .limit(limit != null ? limit : Long.MAX_VALUE)
                    .map(Named::item)
                    .toList();
        }
        String text = plain(query);
        List<String> tokens = SearchMatcher.tokenize(text);
        if (tokens.isEmpty()) {
            return List.of();
        }
        Function<T, List<Field>> fields = item -> names.apply(item).stream().map(name -> Field.name(name, 1)).toList();
        List<T> matches = SearchMatcher.rank(items, tokens, fields, order).stream().map(Hit::item).toList();
        // An exact name before one that only starts with the query, then the biggest.
        Comparator<T> exactFirst = Comparator.comparing((T item) -> !names.apply(item).contains(text))
                .thenComparing(order);
        Stream<T> named = matches.stream().filter(item -> startsWith(names.apply(item), text)).sorted(exactFirst);
        Stream<T> others = matches.stream().filter(item -> !startsWith(names.apply(item), text));
        return Stream.concat(named, others).limit(limit != null ? limit : DEFAULT_LIMIT).toList();
    }

    private static boolean startsWith(List<String> names, String text) {
        return names.stream().anyMatch(name -> name.startsWith(text));
    }

    // Lower case words without accents or punctuation, so "'s-Gravendeel" is "s gravendeel". Place names hold no email
    // addresses, so a dot splits words, as in "Alphen a.d. Rijn", and "st" is short for "sint", as in "St. Oedenrode".
    private static String plain(String text) {
        return SearchText.words(text.replace('.', ' ')).stream()
                .map(word -> word.equals("st") ? "sint" : word)
                .collect(Collectors.joining(" "));
    }
}
