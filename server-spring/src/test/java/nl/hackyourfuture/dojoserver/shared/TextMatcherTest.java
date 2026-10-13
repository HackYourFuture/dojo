package nl.hackyourfuture.dojoserver.shared;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.Comparator;
import java.util.List;

// How TextMatcher scores a query against one text, without Spring or a database.
class TextMatcherTest {

    @ParameterizedTest
    @CsvSource(delimiter = '|', quoteCharacter = '"', textBlock = """
            Amsterdam               | amsterdam | 1
            Amsterdam               | amster    | 0.1
            Amsterdam               | a         | 0.1
            Ouderkerk aan de Amstel | amstel    | 0.04
            Papua New Guinea        | ne        | 0.04
            Rotterdam               | dam       | 0.01
            """)
    void scoresExactThenStartThenWordStartThenContains(String text, String query, double expected) {
        assertThat(TextMatcher.score(text, query)).isEqualTo(expected);
    }

    @ParameterizedTest
    @CsvSource(delimiter = '|', quoteCharacter = '"', textBlock = """
            Alphen a.d. Rijn | ALPHEN A D RIJN
            's-Gravenhage    | s gravenhage
            Zoë O'Neil       | zoe oneil
            Húns             | huns
            """)
    void caseAccentsApostrophesAndDotsDoNotCount(String text, String query) {
        assertThat(TextMatcher.score(text, query)).isGreaterThan(0).isEqualTo(TextMatcher.score(text, text));
    }

    @Test
    void everyKindOfMatchWithoutTyposBeatsEveryCloseSpelling() {
        List<Double> scores = List.of(
                TextMatcher.score("Almere", "almere"),
                TextMatcher.score("Almere", "alme"),
                TextMatcher.score("Ouderkerk aan de Amstel", "amstel"),
                TextMatcher.score("Amsterdam", "dam"),
                // One typo in the whole text, in a half-typed start and in a word of a longer name, which count half.
                TextMatcher.score("Almere", "almre"),
                TextMatcher.score("Rotterdam", "rote"),
                TextMatcher.score("Bergen op Zoom", "zom"));

        assertThat(scores).doesNotContain(0.0).isSortedAccordingTo(Comparator.reverseOrder()).doesNotHaveDuplicates();
    }

    @ParameterizedTest
    @CsvSource({"yusuf, Youssef", "youssef, Yusuf", "muhammad, Mohammed", "muhammad, Mohammed Ali",
            "mohamed, Mohammed", "rachid, Rashid", "fatma, Fatima", "cristina, Christina", "ahmad, Ahmed", "omar, Umar",
            "nur, Noor", "isa, Eissa", "jhon, John", "ali, Aly", "amsterdma, Amsterdam", "rote, Rotterdam",
            "abdulr, Abdelrahman", "hasan, Omar Al-Hassan"})
    void findsACloseSpellingBelowACorrectPart(String query, String text) {
        assertThat(TextMatcher.score(text, query)).isGreaterThan(0).isLessThan(0.001);
    }

    @Test
    void findsACloseSpellingOfSeveralWords() {
        assertThat(TextMatcher.score("Bergen op Zoom", "bergen op zom")).isGreaterThan(0);
        assertThat(TextMatcher.score("Bergen op Zoom", "bergn op zom")).isGreaterThan(0);
        // Half-typed with a typo in a word too short to match on its own.
        assertThat(TextMatcher.score("Bergen op Zoom", "bergen ep z")).isGreaterThan(0);
    }

    @Test
    void aNearerSpellingScoresHigher() {
        assertThat(TextMatcher.score("Maryam", "mariam")).isGreaterThan(TextMatcher.score("Maryem", "mariam"));
    }

    @Test
    void aTypoInAWholeNameBeatsOneInTheStartOrAWordOfALongerName() {
        assertThat(TextMatcher.score("Soest", "soese")).isGreaterThan(TextMatcher.score("Soesterberg", "soese"));
        assertThat(TextMatcher.score("Nieuw-Vennep", "niuw")).isEqualTo(TextMatcher.score("Nieuwegein", "niuw"));
    }

    @Test
    void shortWordsAreNeverCloseSpellings() {
        assertThat(TextMatcher.score("No email yet", "nour")).isZero();
        assertThat(TextMatcher.score("Omar Al-Hassan", "ali")).isZero();
    }

    @ParameterizedTest
    @CsvSource(delimiter = '|', textBlock = """
            Abdul Rahman     | abdulrahman    | 1
            Abdulrahman      | abdul rahman   | 1
            Abdul Rahman     | abdulr         | 0.1
            Coolblue B.V.    | coolblue bv    | 1
            Alphen a.d. Rijn | alphen ad rijn | 1
            """)
    void compoundNamesMatchWithOrWithoutTheirSpaces(String text, String query, double expected) {
        assertThat(TextMatcher.score(text, query)).isEqualTo(expected);
    }

    @ParameterizedTest
    @CsvSource({"sam, Tom", "al, El", "al, Khalid", "abdulrahman, Abdelrahim", "rit, Rotterdam", "omar, Mariam",
            "aldr, Alteveer", "'', Amsterdam", "' . ', Amsterdam"})
    void findsNothingTooShortOrTooFarOff(String query, String text) {
        assertThat(TextMatcher.score(text, query)).isZero();
    }

    @Test
    void nothingMatchesAMissingText() {
        assertThat(TextMatcher.score(null, "amsterdam")).isZero();
        assertThat(TextMatcher.score("Amsterdam", null)).isZero();
    }

    @Test
    void proseMatchesOnlyAtTheStartOfAWord() {
        String notes = "Chose the back-end specialization. Referred by Rahman, who knows Ali from the Hague meetups.";

        assertThat(TextMatcher.score(notes, "chose")).isEqualTo(0.1);
        assertThat(TextMatcher.score(notes, "rahman")).isEqualTo(0.04);
        assertThat(TextMatcher.score(notes, "ali")).isEqualTo(0.04);
        assertThat(TextMatcher.score(notes, "haag")).isZero();
        assertThat(TextMatcher.score(notes, "zation")).isZero();
    }
}
