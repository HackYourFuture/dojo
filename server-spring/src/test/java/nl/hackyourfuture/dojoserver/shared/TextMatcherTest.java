package nl.hackyourfuture.dojoserver.shared;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.Comparator;
import java.util.List;

// How TextMatcher scores a query against a text, without Spring or a database.
class TextMatcherTest {

    @ParameterizedTest
    @CsvSource(delimiter = '|', quoteCharacter = '"', textBlock = """
            Amsterdam               | amsterdam          | 1000
            Alphen a.d. Rijn        | alphen a.d. rijn   | 1000
            's-Gravenhage           | s gravenhage       | 1000
            Zoë O'Neil              | zoe oneil          | 1000
            Amsterdam               | amster             | 100
            Coolblue B.V.           | coolblue b         | 100
            Ouderkerk aan de Amstel | amstel             | 10
            Rotterdam               | dam                | 10
            Papua New Guinea        | ne                 | 10
            """)
    void scoresExactThenStartThenContains(String text, String query, double expected) {
        assertThat(TextMatcher.score(text, query)).isEqualTo(expected);
    }

    @Test
    void everyKindOfMatchWithoutTyposBeatsEveryKindWithThem() {
        List<Double> scores = List.of(
                TextMatcher.score("Almere", "almere"),
                TextMatcher.score("Almere", "alme"),
                TextMatcher.score("Ouderkerk aan de Amstel", "amstel"),
                // One typo in the whole text, in its start, and in a later word.
                TextMatcher.score("Almere", "almre"),
                TextMatcher.score("Rotterdam", "roter"),
                TextMatcher.score("Bergen op Zoom", "zom"));

        assertThat(scores).doesNotContain(0.0).isSortedAccordingTo(Comparator.reverseOrder()).doesNotHaveDuplicates();
    }

    @ParameterizedTest
    @CsvSource({"yusuf, Youssef", "muhammad, Mohammed", "jhon, John", "ali, Aly", "amsterdma, Amsterdam",
            "bergen op zom, Bergen op Zoom", "alphen ad rijn, Alphen a.d. Rijn", "rote, Rotterdam",
            "abdulr, Abdelrahman"})
    void findsSpellingsWithTypos(String query, String text) {
        assertThat(TextMatcher.score(text, query)).isGreaterThan(0).isLessThan(10);
    }

    @Test
    void aNearerSpellingScoresHigher() {
        assertThat(TextMatcher.score("Maryam", "mariam")).isGreaterThan(TextMatcher.score("Maryem", "mariam"));
    }

    @ParameterizedTest
    @CsvSource({"sam, Tom", "al, El", "al, Khalid", "abdulrahman, Abdelrahim", "rit, Rotterdam", "omar, Mariam",
            "aldr, Alteveer", "a, Amsterdam", "'', Amsterdam", "' . ', Amsterdam"})
    void findsNothingTooShortOrTooFarOff(String query, String text) {
        assertThat(TextMatcher.score(text, query)).isZero();
    }

    @Test
    void nothingMatchesAMissingText() {
        assertThat(TextMatcher.score(null, "amsterdam")).isZero();
        assertThat(TextMatcher.score("Amsterdam", null)).isZero();
    }

    @Test
    void ranksByTheBestTextThenTheTies() {
        List<List<String>> places = List.of(List.of("Mokum"), List.of("Amstelveen"), List.of("Amsterdam", "Mokum"),
                List.of("Rotterdam"));

        Comparator<List<String>> fewestNamesFirst = Comparator.comparingInt(List::size);
        Comparator<List<String>> byFirstName = Comparator.comparing(names -> names.get(0));

        assertThat(TextMatcher.rank(places, "mokum", names -> names, fewestNamesFirst))
                .containsExactly(new Hit<>(List.of("Mokum"), 1000), new Hit<>(List.of("Amsterdam", "Mokum"), 1000));
        assertThat(TextMatcher.rank(places, "ams", names -> names, byFirstName)).extracting(Hit::item)
                .containsExactly(List.of("Amstelveen"), List.of("Amsterdam", "Mokum"));
    }
}
