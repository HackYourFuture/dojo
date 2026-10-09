package nl.hackyourfuture.dojoserver.geo;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.shared.StringUtils;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.stream.IntStream;

// How the geo search ranks real place names, without Spring or a database.
class GeoRankingTest {
    private static final City AMSTERDAM = city("Amsterdam", 922557, "Mokum");
    private static final City ROTTERDAM = city("Rotterdam", 612249);
    private static final City THE_HAGUE = city("The Hague", 569468, "'s-Gravenhage", "Den Haag", "Hague");
    private static final City AMSTELVEEN = city("Amstelveen", 95840);
    private static final City DEN_HELDER = city("Den Helder", 40970);
    private static final Country NETHERLANDS = country("NL", "Netherlands", 17231017, "Nederland", "Holland",
            "The Netherlands");
    private static final Country NEPAL = country("NP", "Nepal", 28087871);

    // ------------------------------------------------------------------ cities

    @Test
    void namesThatStartWithTheQueryComeFirst() {
        City loonOpZand = city("Loon op Zand", 5800);
        City zandvoort = city("Zandvoort", 16310);

        // Loon op Zand matches "zand" as a whole word, which scores higher, but Zandvoort starts with it.
        assertThat(names(GeoService.rankCities(List.of(loonOpZand, zandvoort), "zand", null)))
                .containsExactly("Zandvoort", "Loon op Zand");
        assertThat(names(GeoService.rankCities(List.of(loonOpZand, zandvoort), "zand", 1)))
                .containsExactly("Zandvoort");
    }

    @Test
    void anExactNameComesFirst() {
        City beek = city("Beek", 8415);
        City beekEnDonk = city("Beek en Donk", 10110);

        assertThat(names(GeoService.rankCities(List.of(beekEnDonk, beek), "beek", null)))
                .containsExactly("Beek", "Beek en Donk");
    }

    @Test
    void namesThatStartWithTheQueryGoBiggestFirst() {
        City nieuwVennep = city("Nieuw-Vennep", 30665);
        City nieuwePekela = city("Nieuwe Pekela", 3895);
        City nieuwegein = city("Nieuwegein", 68257);

        // Nieuw-Vennep matches "nieuw" as a whole word, which scores higher, but Nieuwegein is bigger.
        assertThat(names(GeoService.rankCities(List.of(nieuwVennep, nieuwePekela, nieuwegein), "nieuw", null)))
                .containsExactly("Nieuwegein", "Nieuw-Vennep", "Nieuwe Pekela");
    }

    @Test
    void comparesTheStartAsSearchWords() {
        City huns = city("Húns", 115);
        City hunsel = city("Hunsel", 690);
        City oudAde = city("Oud Ade", 385);
        City oudAlblas = city("Oud-Alblas", 1260);

        // Húns starts with "huns" without its accent, and Oud-Alblas with "oud a" without its dash.
        assertThat(names(GeoService.rankCities(List.of(hunsel, huns), "huns", null))).containsExactly("Húns", "Hunsel");
        assertThat(names(GeoService.rankCities(List.of(oudAde, oudAlblas), "oud a", null)))
                .containsExactly("Oud-Alblas", "Oud Ade");
    }

    @Test
    void equalMatchesGoToTheBiggestPlace() {
        City ouderkerk = city("Ouderkerk aan de Amstel", 8110);

        assertThat(names(GeoService.rankCities(List.of(ouderkerk, AMSTELVEEN, AMSTERDAM), "ams", null)))
                .containsExactly("Amsterdam", "Amstelveen", "Ouderkerk aan de Amstel");
    }

    @Test
    void findsPartsOfNamesFromThreeLetters() {
        City damwald = city("Damwâld", 5560);
        City edam = city("Edam", 7380);

        // Damwâld starts with "dam", Edam is a close spelling, and the others only contain it.
        assertThat(names(GeoService.rankCities(List.of(ROTTERDAM, edam, AMSTERDAM, damwald), "dam", null)))
                .containsExactly("Damwâld", "Edam", "Amsterdam", "Rotterdam");
    }

    @Test
    void findsAHalfTypedNameWithATypo() {
        assertThat(names(GeoService.rankCities(List.of(AMSTERDAM, ROTTERDAM), "roter", null)))
                .containsExactly("Rotterdam");
    }

    @Test
    void aTypoInAWholeNameBeatsOneInTheStartOfALongerName() {
        City tilburg = city("Tilburg", 210236);
        City tiel = city("Tiel", 39290);

        // "teil" swaps two letters of Tiel and drops one from the start of Tilburg, which is far bigger.
        assertThat(names(GeoService.rankCities(List.of(tilburg, tiel), "teil", null))).containsExactly("Tiel",
                "Tilburg");
    }

    @Test
    void aCloseStartRanksBelowACorrectWord() {
        City ouderkerk = city("Ouderkerk aan de Amstel", 8110);

        // "amstel" is one letter off the start of Amsterdam, which is far bigger, but Ouderkerk spells it right.
        assertThat(names(GeoService.rankCities(List.of(AMSTERDAM, ouderkerk, AMSTELVEEN), "amstel", null)))
                .containsExactly("Amstelveen", "Ouderkerk aan de Amstel", "Amsterdam");
    }

    @Test
    void findsPlacesByTheirAlternativeNames() {
        List<City> cities = List.of(DEN_HELDER, AMSTERDAM, THE_HAGUE);

        assertThat(names(GeoService.rankCities(cities, "den haag", null))).containsExactly("The Hague");
        assertThat(names(GeoService.rankCities(cities, "haag", null))).containsExactly("The Hague");
        assertThat(names(GeoService.rankCities(cities, "s grav", null))).containsExactly("The Hague");
        assertThat(names(GeoService.rankCities(cities, "den", null))).containsExactly("The Hague", "Den Helder");
    }

    @Test
    void alternativeNamesRankLikeTheName() {
        City mokum = city("Mokum", 10);

        assertThat(names(GeoService.rankCities(List.of(mokum, AMSTERDAM), "mokum", null)))
                .containsExactly("Amsterdam", "Mokum");
    }

    @Test
    void splitsWordsOnDots() {
        City capelle = city("Capelle aan den IJssel", 69698, "Capelle a/d IJssel");

        // Typed as "a.d.", the abbreviation splits into "a" and "d"; kept whole, "a.d" would match nothing.
        assertThat(names(GeoService.rankCities(List.of(capelle), "capelle a.d. ijssel", null)))
                .containsExactly("Capelle aan den IJssel");
    }

    @Test
    void readsStAsSint() {
        City sintOedenrode = city("Sint-Oedenrode", 11900);

        assertThat(names(GeoService.rankCities(List.of(sintOedenrode), "st oedenrode", null)))
                .containsExactly("Sint-Oedenrode");
        assertThat(names(GeoService.rankCities(List.of(sintOedenrode), "st. oed", null)))
                .containsExactly("Sint-Oedenrode");
    }

    @Test
    void equalPopulationsGoById() {
        City noordenveld = city("Alteveer (Noordenveld)", 0);
        City hoogeveen = city("Alteveer (Hoogeveen)", 0);

        assertThat(GeoService.rankCities(List.of(noordenveld, hoogeveen), "alteveer", null))
                .extracting(City::getId).containsExactly("alteveer-hoogeveen", "alteveer-noordenveld");
    }

    @Test
    void returnsEveryCityByNameWithoutAQuery() {
        List<City> cities = List.of(city("Zandvoort", 16310), city("'s-Gravendeel", 8095), city("Hunsel", 690),
                city("Húns", 115), AMSTERDAM);

        // Case, accents and punctuation don't count: 's-Gravendeel files under S and Húns before Hunsel.
        assertThat(names(GeoService.rankCities(cities, null, null)))
                .containsExactly("Amsterdam", "Húns", "Hunsel", "'s-Gravendeel", "Zandvoort");
    }

    @Test
    void findsNothingForASingleLetterOrOnlySpaces() {
        assertThat(GeoService.rankCities(List.of(AMSTERDAM), "a", null)).isEmpty();
        assertThat(GeoService.rankCities(List.of(AMSTERDAM), "  ", null)).isEmpty();
        assertThat(GeoService.rankCities(List.of(AMSTERDAM), "", null)).isEmpty();
    }

    @Test
    void returnsTwentyMatchesUnlessLimited() {
        List<City> cities = IntStream.range(0, 25).mapToObj(i -> city("Testdorp " + i, i)).toList();

        assertThat(GeoService.rankCities(cities, "testdorp", null)).hasSize(20);
        assertThat(GeoService.rankCities(cities, "testdorp", 25)).hasSize(25);
        assertThat(names(GeoService.rankCities(cities, "testdorp", 2))).containsExactly("Testdorp 24", "Testdorp 23");
    }

    @Test
    void limitsTheListWithoutAQuery() {
        List<City> cities = List.of(AMSTELVEEN, ROTTERDAM, AMSTERDAM);

        assertThat(names(GeoService.rankCities(cities, null, 2))).containsExactly("Amstelveen", "Amsterdam");
    }

    // ------------------------------------------------------------------ countries

    @Test
    void countriesThatStartWithTheQueryComeFirst() {
        List<Country> countries = List.of(country("BQ", "Caribbean Netherlands", 18012, "Caribisch Nederland"),
                country("NE", "Niger", 22442948), country("PG", "Papua New Guinea", 8606316),
                country("NZ", "New Zealand", 4885500), NEPAL, NETHERLANDS);

        // Papua New Guinea is bigger, but New Zealand starts with "ne". Two letters match neither a close spelling nor
        // part of a word, and codes are not searched, so no Niger.
        assertThat(GeoService.rankCountries(countries, "ne", null)).extracting(Country::getId)
                .containsExactly("NP", "NL", "NZ", "PG", "BQ");
    }

    @Test
    void findsCountriesByTheirAlternativeNames() {
        Country unitedKingdom = country("GB", "United Kingdom", 66488991, "UK", "Verenigd Koninkrijk", "VK");
        Country virginIslands = country("VI", "United States Virgin Islands", 106977, "U.S. Virgin Islands");
        List<Country> countries = List.of(NEPAL, NETHERLANDS, unitedKingdom, virginIslands);

        assertThat(GeoService.rankCountries(countries, "holland", null)).extracting(Country::getId)
                .containsExactly("NL");
        assertThat(GeoService.rankCountries(countries, "the netherlands", null)).extracting(Country::getId)
                .containsExactly("NL");
        assertThat(GeoService.rankCountries(countries, "uk", null)).extracting(Country::getId).containsExactly("GB");
        assertThat(GeoService.rankCountries(countries, "verenigd", null)).extracting(Country::getId)
                .containsExactly("GB");
        // A dot splits words in names too, so "U.S." reads as "u s".
        assertThat(GeoService.rankCountries(countries, "us virgin", null)).extracting(Country::getId)
                .containsExactly("VI");
    }

    @Test
    void equalCountryMatchesGoToTheBiggestCountry() {
        List<Country> countries = List.of(country("AE", "United Arab Emirates", 9630959),
                country("US", "United States", 327167434), country("GB", "United Kingdom", 66488991));

        assertThat(GeoService.rankCountries(countries, "united", null)).extracting(Country::getId)
                .containsExactly("US", "GB", "AE");
    }

    @Test
    void equalCountryPopulationsGoById() {
        List<Country> countries = List.of(country("HM", "Heard Island and McDonald Islands", 0),
                country("BV", "Bouvet Island", 0));

        assertThat(GeoService.rankCountries(countries, "island", null)).extracting(Country::getId)
                .containsExactly("BV", "HM");
    }

    @Test
    void returnsEveryCountryByNameWithoutAQuery() {
        List<Country> countries = List.of(country("AL", "Albania", 2866376), NETHERLANDS,
                country("AX", "Åland Islands", 26711), country("AF", "Afghanistan", 37172386));

        assertThat(GeoService.rankCountries(countries, null, null)).extracting(Country::getId)
                .containsExactly("AF", "AX", "AL", "NL");
    }

    // ------------------------------------------------------------------ helpers

    private static List<String> names(List<City> cities) {
        return cities.stream().map(City::getName).toList();
    }

    // The id is the name as a slug, as scripts/setup makes it.
    private static City city(String name, int population, String... alternativeNames) {
        return City.builder().id(StringUtils.slug(name)).name(name).population(population)
                .alternativeNames(List.of(alternativeNames)).build();
    }

    private static Country country(String id, String name, int population, String... alternativeNames) {
        return Country.builder().id(id).name(name).alternativeNames(List.of(alternativeNames)).population(population)
                .flag("🏳️").code(id).build();
    }
}
