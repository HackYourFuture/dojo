package nl.hackyourfuture.dojoserver.search;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.search.SearchMatcher.Field;
import nl.hackyourfuture.dojoserver.search.dto.SearchResult;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

import java.util.List;

// The ranking rules and the worked examples from the search design, without Spring or a database.
class SearchRankingTest {

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
            "omar, Umar", "nur, Noor", "isa, Eissa", "ali, Aly"})
    void namesMatchCloseSpellings(String query, String name) {
        assertThat(score(query, Field.name(name, 1))).isGreaterThan(0).isLessThan(10);
    }

    @ParameterizedTest
    @CsvSource({"sam, Tom", "al, El", "ali, Khalid", "abdulrahman, Abdelrahim"})
    void namesDoNotMatchDistantSpellings(String query, String name) {
        assertThat(score(query, Field.name(name, 1))).isZero();
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

    // ------------------------------------------------------------------ trainee ranking

    @Test
    void ranksByTheNameTheTraineeGoesByThenFirstNameThenLastName() {
        Trainee noPreferredName = trainee(null, "Mariam", "Haddad", 55);
        Trainee preferredName = trainee("Mariam", "Maryam", "Yilmaz", 52);
        Trainee legalFirstName = trainee("Mimi", "Mariam", "Rahimi", 56);
        Trainee lastName = trainee(null, "Fatima", "Mariam", 57);
        Trainee startOfName = trainee(null, "Mariama", "Diallo", 58);
        Trainee closeSpelling = trainee(null, "Maryam", "Saleh", 58);
        Trainee inTheNotes = Trainee.builder().id("notes").firstName("Sana").lastName("Osman").currentCohort(58)
                .comments("Sister of Mariam").build();

        List<SearchResult> results = rank("mariam", noPreferredName, preferredName, legalFirstName, lastName,
                startOfName, closeSpelling, inTheNotes);

        assertThat(results).extracting(SearchResult::id).containsExactly(noPreferredName.getId(),
                preferredName.getId(), legalFirstName.getId(), lastName.getId(), startOfName.getId(),
                closeSpelling.getId(), inTheNotes.getId());
        assertThat(scores(results)).containsExactly(5000.0, 5000.0, 4000.0, 3000.0, 500.0,
                41.667, 1.0);
    }

    @Test
    void ranksAPartialSecondWordByWhereTheWordsMatch() {
        Trainee mariamHaddad = trainee(null, "Mariam", "Haddad", 50);
        Trainee hanaMariam = trainee(null, "Hana", "Mariam", 50);
        Trainee mariamaHussein = trainee(null, "Mariama", "Hussein", 50);

        List<SearchResult> results = rank("mariam h", mariamaHussein, hanaMariam, mariamHaddad);

        assertThat(results).extracting(SearchResult::id).containsExactly(mariamHaddad.getId(), hanaMariam.getId(),
                mariamaHussein.getId());
        assertThat(scores(results)).containsExactly(5300.0, 3500.0, 800.0);
    }

    @Test
    void findsTheOwnerOfAGithubHandleBeforeSimilarNames() {
        Trainee owner = Trainee.builder().id("owner").firstName("Bilal").lastName("Aziz").githubHandle("omarn")
                .build();
        Trainee omar = trainee(null, "Omar", "Farouk", 50);

        List<SearchResult> results = rank("omarn", omar, owner);

        assertThat(results).extracting(SearchResult::id).containsExactly(owner.getId(), omar.getId());
        assertThat(scores(results)).containsExactly(1000.0, 40.0);
    }

    @Test
    void findsOnlyTheOwnerOfAnEmailAddress() {
        Trainee owner = Trainee.builder().id("owner").firstName("Omar").lastName("Nasser")
                .email("omar.nasser@example.org").build();
        Trainee otherOmar = trainee(null, "Omar", "Farouk", 50);

        List<SearchResult> results = rank("Omar.Nasser@example.org", owner, otherOmar);

        assertThat(results).extracting(SearchResult::id).containsExactly(owner.getId());
        assertThat(scores(results)).containsExactly(2000.0);
        assertThat(rank("someone@else.org", owner, otherOmar)).isEmpty();
        assertThat(rank("omar.naser@example.org", owner, otherOmar)).isEmpty();
    }

    @Test
    void putsTheNewestCohortFirstAndTraineesWithoutACohortLast() {
        Trainee noCohort = trainee(null, "Mariam", "Haddad", null);
        Trainee older = trainee(null, "Mariam", "Haddad", 50);
        Trainee newer = trainee(null, "Mariam", "Haddad", 51);

        assertThat(rank("mariam", noCohort, older, newer)).extracting(SearchResult::id)
                .containsExactly(newer.getId(), older.getId(), noCohort.getId());
    }

    @Test
    void doesNotSplitNamesOnApostrophes() {
        Trainee safaa = trainee(null, "Safa'a", "Moussa", 50);

        assertThat(rank("mo a", safaa)).isEmpty();
        assertThat(scores(rank("safaa", safaa))).containsExactly(5000.0);
        assertThat(scores(rank("safa'a", safaa))).containsExactly(5000.0);
    }

    @Test
    void breaksRemainingTiesByDisplayNameThenId() {
        Trainee zaki = Trainee.builder().id("a").firstName("Mariam").lastName("Zaki").currentCohort(50).build();
        Trainee aziz = Trainee.builder().id("b").firstName("Mariam").lastName("Aziz").currentCohort(50).build();
        Trainee sameNameLaterId = Trainee.builder().id("d").firstName("Mariam").lastName("Aziz").currentCohort(50)
                .build();
        Trainee sameNameEarlierId = Trainee.builder().id("c").firstName("Mariam").lastName("Aziz").currentCohort(50)
                .build();

        assertThat(rank("mariam", zaki, sameNameLaterId, aziz, sameNameEarlierId)).extracting(SearchResult::id)
                .containsExactly("b", "c", "d", "a");
    }

    // ------------------------------------------------------------------ helpers

    private static double score(String query, Field... fields) {
        return SearchMatcher.score(SearchMatcher.tokenize(query), List.of(fields));
    }

    private static List<SearchResult> rank(String query, Trainee... trainees) {
        return SearchService.rankTrainees(List.of(trainees), SearchMatcher.tokenize(query));
    }

    // Close spellings score fractions, so compare to three decimals.
    private static List<Double> scores(List<SearchResult> results) {
        return results.stream().map(result -> Math.round(result.score() * 1000) / 1000.0).toList();
    }

    private static Trainee trainee(String preferredName, String firstName, String lastName, Integer cohort) {
        String id = firstName + "-" + lastName + "-" + cohort;
        return Trainee.builder().id(id).preferredName(preferredName).firstName(firstName).lastName(lastName)
                .currentCohort(cohort).build();
    }
}
