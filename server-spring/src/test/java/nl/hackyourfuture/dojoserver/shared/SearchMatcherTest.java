package nl.hackyourfuture.dojoserver.shared;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.shared.SearchMatcher.Field;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.List;

// How SearchText splits text into words and SearchMatcher scores them, without Spring or a database.
class SearchMatcherTest {

    // ------------------------------------------------------------------ words

    @ParameterizedTest
    @CsvSource(delimiter = '|', textBlock = """
            Zoë Müller              | zoe muller
            Yıldız                  | yildiz
            Al-Hassan O’Neil        | al hassan oneil
            Safa'a Moussa           | safaa moussa
            Asma' Al-Rifaʼi         | asma al rifai
            '  Ali    Khan  '       | ali khan
            omar_n+dojo@example.org | omar_n+dojo@example.org
            Lives in Rotterdam.     | lives in rotterdam
            (@omar_n)               | omar_n
            Łukasz Østergaard Đorđe Strauß Æsa Cœur | lukasz ostergaard dorde strauss aesa coeur
            李𠀀明 Иван مريم         | 李𠀀明 иван مريم
            """)
    void splitsTextIntoLowerCaseWordsWithoutAccents(String text, String expected) {
        assertThat(String.join(" ", SearchText.words(text))).isEqualTo(expected);
    }

    @Test
    void findsNoWordsInNothing() {
        assertThat(SearchText.words(null)).isEmpty();
        assertThat(SearchText.words(" - ' . ")).isEmpty();
    }

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
            "omar, Umar", "nur, Noor", "isa, Eissa", "ali, Aly", "eed, Ede"})
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

    @ParameterizedTest
    @CsvSource({"roter, Rotterdam", "amstr, Amsterdam", "abdulr, Abdelrahman", "rote, Rotterdam"})
    void aHalfTypedWordMatchesTheCloseStartOfALongerName(String query, String name) {
        assertThat(score(query, Field.name(name, 1))).isGreaterThan(0).isLessThan(10);
    }

    @Test
    void closeStartsNeedFourLettersAndTheSameFirstLetter() {
        assertThat(score("rit", Field.name("Rotterdam", 1))).isZero();
        assertThat(score("omar", Field.name("Mariam", 1))).isZero();
        // Two edits off the start of Alteveer.
        assertThat(score("aldr", Field.name("Alteveer", 1))).isZero();
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
