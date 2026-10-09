package nl.hackyourfuture.dojoserver.geo;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * The geo endpoints over MockMvc, against the local development database, so transactional. Every seeded city and
 * country holds a random word, so a search for it never returns the cities and countries that scripts/setup loads.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class GeoEndpointTest {
    private static final String CITIES = "/api/geo/cities";
    private static final String COUNTRIES = "/api/geo/countries";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private CityRepository cityRepository;
    @Autowired
    private CountryRepository countryRepository;

    private String word;

    @BeforeEach
    void givenARandomWord() {
        word = RandomUtils.generateRandomId();
    }

    @Test
    void ranksExactNamesThenStartsThenOtherMatches() {
        // "Oost <word>" is the biggest and matches the whole word, but the other three start with the query.
        City laterWord = cityRepository.save(city("Oost " + word, 9));
        City startOfName = cityRepository.save(city(word + "dorp", 5));
        City alternativeName = cityRepository.save(city("Noord", 1, word));
        City exactName = cityRepository.save(city(word, 2));

        MvcTestResult result = get(CITIES, word);

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(exactName.getId(), alternativeName.getId(), startOfName.getId(), laterWord.getId());
    }

    @Test
    void returnsTheWholeCity() {
        City city = cityRepository.save(City.builder()
                .id(word)
                .name("Hengelo " + word)
                .alternativeNames(List.of("Old " + word, "Oude " + word))
                .population(4510)
                .province("Gelderland")
                .region("Achterhoek")
                .latitude(52.05083)
                .longitude(6.30972)
                .distanceAmsterdam(132)
                .build());

        MvcTestResult result = get(CITIES, word);

        assertThat(result).bodyJson().extractingPath("$[0].id").isEqualTo(city.getId());
        assertThat(result).bodyJson().extractingPath("$[0].name").isEqualTo("Hengelo " + word);
        assertThat(result).bodyJson().extractingPath("$[0].alternativeNames").asArray()
                .containsExactly("Old " + word, "Oude " + word);
        assertThat(result).bodyJson().extractingPath("$[0].population").isEqualTo(4510);
        assertThat(result).bodyJson().extractingPath("$[0].province").isEqualTo("Gelderland");
        assertThat(result).bodyJson().extractingPath("$[0].region").isEqualTo("Achterhoek");
        assertThat(result).bodyJson().extractingPath("$[0].coordinates.lat").isEqualTo(52.05083);
        assertThat(result).bodyJson().extractingPath("$[0].coordinates.lon").isEqualTo(6.30972);
        assertThat(result).bodyJson().extractingPath("$[0].distanceAmsterdam").isEqualTo(132);
    }

    @Test
    void returnsEveryCityWithoutAQuery() {
        City city = cityRepository.save(city(word, 1));

        assertThat(mvc.get().uri(CITIES).exchange()).bodyJson().extractingPath("$[*].id").asArray()
                .contains(city.getId());
    }

    @Test
    void ranksCountriesByPopulationThenId() {
        Country smallB = countryRepository.save(country(word + "-b"));
        Country smallA = countryRepository.save(country(word + "-a"));
        Country big = countryRepository.save(country(word + "-c", 2000));

        MvcTestResult result = get(COUNTRIES, word);

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(big.getId(), smallA.getId(), smallB.getId());
    }

    @Test
    void findsCountriesByTheirAlternativeNames() {
        // A second random word, so only the alternative name can match.
        String alternativeName = RandomUtils.generateRandomId();
        Country country = countryRepository.save(country(word, 1000, alternativeName));

        assertThat(get(COUNTRIES, alternativeName)).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(country.getId());
    }

    @Test
    void returnsTheWholeCountry() {
        countryRepository.save(country(word, 17231017, "Oud " + word));

        MvcTestResult result = get(COUNTRIES, word);

        assertThat(result).bodyJson().extractingPath("$[0].id").isEqualTo(word);
        assertThat(result).bodyJson().extractingPath("$[0].name").isEqualTo("Land " + word);
        assertThat(result).bodyJson().extractingPath("$[0].alternativeNames").asArray().containsExactly("Oud " + word);
        assertThat(result).bodyJson().extractingPath("$[0].population").isEqualTo(17231017);
        assertThat(result).bodyJson().extractingPath("$[0].flag").isEqualTo("🏔️");
        assertThat(result).bodyJson().extractingPath("$[0].code").isEqualTo(word);
    }

    @Test
    void returnsEveryCountryWithoutAQuery() {
        Country country = countryRepository.save(country(word));

        assertThat(mvc.get().uri(COUNTRIES).exchange()).bodyJson().extractingPath("$[*].id").asArray()
                .contains(country.getId());
    }

    @Test
    void returnsAsManyResultsAsTheLimit() {
        City bigger = cityRepository.save(city(word + "stad", 2));
        cityRepository.save(city(word + "dorp", 1));
        countryRepository.save(country(word + "-a"));
        countryRepository.save(country(word + "-b"));

        assertThat(mvc.get().uri(CITIES).param("q", word).param("limit", "1").exchange()).bodyJson()
                .extractingPath("$[*].id").asArray().containsExactly(bigger.getId());
        assertThat(mvc.get().uri(COUNTRIES).param("q", word).param("limit", "1").exchange()).bodyJson()
                .extractingPath("$[*].id").asArray().containsExactly(word + "-a");
        // Without a query, CI only has the seeded rows and a local database has thousands.
        assertThat(mvc.get().uri(CITIES).param("limit", "1").exchange()).bodyJson()
                .extractingPath("$[*].id").asArray().hasSize(1);
    }

    @Test
    void rejectsALimitBelowOne() {
        assertThat(mvc.get().uri(CITIES).param("limit", "0").exchange()).hasStatus(400);
        assertThat(mvc.get().uri(COUNTRIES).param("q", "ne").param("limit", "-1").exchange()).hasStatus(400);
    }

    @Test
    void returnsNothingForAQueryShorterThanTwoCharacters() {
        cityRepository.save(city(word, 1));
        countryRepository.save(country(word));
        // Searched for, one letter would match both as the start of a word.
        String letter = word.substring(0, 1);

        assertThat(get(CITIES, letter)).hasStatusOk().bodyJson().isEqualTo("[]");
        assertThat(get(COUNTRIES, letter)).hasStatusOk().bodyJson().isEqualTo("[]");
    }

    @Test
    void rejectsAQueryLongerThanOneHundredCharacters() {
        assertThat(get(CITIES, "m".repeat(101))).hasStatus(400);
        assertThat(get(COUNTRIES, "m".repeat(101))).hasStatus(400);
    }

    @Test
    @WithAnonymousUser
    void needsASignedInUser() {
        assertThat(get(CITIES, "amsterdam")).hasStatus(401);
        assertThat(get(COUNTRIES, "netherlands")).hasStatus(401);
    }

    private MvcTestResult get(String uri, String query) {
        return mvc.get().uri(uri).param("q", query).exchange();
    }

    private City city(String name, int population, String... alternativeNames) {
        return City.builder()
                .id(RandomUtils.generateRandomId())
                .name(name)
                .alternativeNames(List.of(alternativeNames))
                .population(population)
                .province("Utrecht")
                .region("Midden-Utrecht")
                .latitude(52.09)
                .longitude(5.12)
                .build();
    }

    private Country country(String id) {
        return country(id, 1);
    }

    // Named "Land <word>", so a search for the word finds it by name; ids and codes are not searched.
    private Country country(String id, int population, String... alternativeNames) {
        return Country.builder()
                .id(id)
                .name("Land " + word)
                .alternativeNames(List.of(alternativeNames))
                .population(population)
                .flag("🏔️")
                .code(id)
                .build();
    }
}
