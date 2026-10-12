package nl.hackyourfuture.dojoserver.search;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.search.SearchMatcher.Field;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.List;

// How SearchMatcher scores query words against fields, without Spring or a database.
class SearchMatcherTest {

    @Test
    void tokenizesIntoDistinctWords() {
        assertThat(SearchMatcher.tokenize("Mariam  H")).containsExactly("mariam", "h");
        assertThat(SearchMatcher.tokenize("john John")).containsExactly("john");
    }

    @Test
    void ignoresQueriesWithFewerThanTwoLettersOrDigits() {
        assertThat(SearchMatcher.tokenize("m")).isEmpty();
        assertThat(SearchMatcher.tokenize("   ")).isEmpty();
        assertThat(SearchMatcher.tokenize("- '")).isEmpty();
        assertThat(SearchMatcher.tokenize("al")).containsExactly("al");
        assertThat(SearchMatcher.tokenize("a b")).containsExactly("a", "b");
    }

    // ------------------------------------------------------------------ matching rules

    @Test
    void aBetterKindOfMatchBeatsABetterField() {
        assertThat(score("omar", Field.name("Omar", 1))).isEqualTo(1000);
        assertThat(score("omar", Field.name("Omari", 5))).isEqualTo(500);
    }

    @Test
    void everyWordMustMatchSomewhere() {
        assertThat(score("mariam haddad", Field.name("Mariam", 5))).isZero();
        assertThat(score("mariam haddad", Field.name("Mariam", 5), Field.name("Haddad", 3))).isEqualTo(8000);
    }

    @ParameterizedTest
    @CsvSource({"yusuf, Yousef", "yusuf, Youssef", "youssef, Yusuf", "muhammad, Mohammed", "mohamed, Mohammed",
            "rachid, Rashid", "fatma, Fatima", "cristina, Christina", "hasan, Hassan", "ahmad, Ahmed", "jhon, John",
            "omar, Umar", "nur, Noor", "isa, Eissa", "ali, Aly"})
    void namesMatchCloseSpellings(String query, String name) {
        assertThat(score(query, Field.name(name, 1))).isGreaterThan(0).isLessThan(10);
    }

    @ParameterizedTest
    @CsvSource({"sam, Tom", "al, El", "abdulrahman, Abdelrahim"})
    void namesDoNotMatchDistantSpellings(String query, String name) {
        assertThat(score(query, Field.name(name, 1))).isZero();
    }

    @Test
    void partsOfNamesNeedAtLeastThreeLetters() {
        assertThat(score("al", Field.name("Khalid", 1))).isZero();
        assertThat(score("ali", Field.name("Khalid", 1))).isEqualTo(1);
    }

    @Test
    void aNearerSpellingScoresHigher() {
        assertThat(score("mariam", Field.name("Maryam", 1))).isGreaterThan(score("mariam", Field.name("Maryem", 1)));
    }

    @Test
    void compoundNamesMatchWithOrWithoutSpaces() {
        assertThat(score("abdulrahman", Field.name("Abdul Rahman", 1))).isEqualTo(1000);
        assertThat(score("rahman", Field.name("Abdulrahman", 1))).isEqualTo(1);
        assertThat(score("hassan", Field.name("Al-Hassan", 1))).isEqualTo(1000);
        assertThat(score("vand", Field.name("van der Berg", 1))).isEqualTo(100);
        assertThat(score("abdul rahman", Field.name("Abdulrahman", 5))).isEqualTo(10000);
        assertThat(score("abdul-rahman", Field.name("Abdulrahman", 5))).isEqualTo(10000);
    }

    @Test
    void joiningTheQueryWordsNeverLoosensAQuery() {
        assertThat(score("mariam h", Field.name("Mariam", 5))).isZero();
        assertThat(score("mari am", Field.name("Mariama", 5))).isZero();
    }

    @Test
    void textFieldsMatchNeitherCloseSpellingsNorPartsOfWords() {
        assertThat(score("mohamed", Field.text("Mohammed", 1))).isZero();
        assertThat(score("hammed", Field.text("Mohammed", 1))).isZero();
        assertThat(score("roter", Field.text("Rotterdam", 1))).isZero();
        assertThat(score("mohammed", Field.text("Mohammed", 1))).isEqualTo(1000);
    }

    @Test
    void aCommentHitScoresBelowTheWeakestNameHit() {
        double comment = score("rahman", Field.text("Referred by Rahman.", 0.001));
        double partOfLastName = score("rahman", Field.name("Abdulrahman", 3));
        assertThat(comment).isEqualTo(1);
        assertThat(partOfLastName).isEqualTo(3);
    }

    @Test
    void emptyFieldsNeverMatch() {
        assertThat(score("mariam", Field.name(null, 5), Field.text("", 1))).isZero();
    }

    // ------------------------------------------------------------------ helpers

    private static double score(String query, Field... fields) {
        return SearchMatcher.score(SearchMatcher.tokenize(query), List.of(fields));
    }
}
