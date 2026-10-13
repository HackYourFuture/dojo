package nl.hackyourfuture.dojoserver.search;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.partner.contactperson.ContactPerson;
import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;
import nl.hackyourfuture.dojoserver.search.SearchService.Field;
import nl.hackyourfuture.dojoserver.search.dto.SearchResult;
import nl.hackyourfuture.dojoserver.search.dto.SearchResultType;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.volunteer.Volunteer;
import org.junit.jupiter.api.Test;

import java.util.List;

// How SearchService ranks and merges the four record types, without Spring or a database.
class SearchRankingTest {

    // ------------------------------------------------------------------ trainees

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
        assertThat(scores(results)).startsWith(5.0, 5.0, 4.0, 3.0, 0.5).endsWith(0.00004);
    }

    @Test
    void ranksAPartialSecondWordByWhereTheWordsMatch() {
        Trainee mariamHaddad = trainee(null, "Mariam", "Haddad", 50);
        Trainee hanaMariam = trainee(null, "Hana", "Mariam", 50);
        Trainee mariamaHussein = trainee(null, "Mariama", "Hussein", 50);

        List<SearchResult> results = rank("mariam h", mariamaHussein, hanaMariam, mariamHaddad);

        assertThat(results).extracting(SearchResult::id).containsExactly(mariamHaddad.getId(), hanaMariam.getId(),
                mariamaHussein.getId());
        assertThat(scores(results)).containsExactly(5.3, 3.5, 0.8);
    }

    @Test
    void findsTheOwnerOfAGithubHandleBeforeSimilarNames() {
        Trainee owner = Trainee.builder().id("owner").firstName("Bilal").lastName("Aziz").githubHandle("omarn")
                .build();
        Trainee omar = trainee(null, "Omar", "Farouk", 50);

        List<SearchResult> results = rank("omarn", omar, owner);

        assertThat(results).extracting(SearchResult::id).containsExactly(owner.getId(), omar.getId());
        assertThat(scores(results)).containsExactly(1.0, 0.002);
    }

    @Test
    void findsOnlyTheOwnerOfAnEmailAddress() {
        Trainee owner = Trainee.builder().id("owner").firstName("Omar").lastName("Nasser")
                .email("omar.nasser@example.org").build();
        Trainee otherOmar = trainee(null, "Omar", "Farouk", 50);

        List<SearchResult> results = rank("Omar.Nasser@example.org", owner, otherOmar);

        assertThat(results).extracting(SearchResult::id).containsExactly(owner.getId());
        assertThat(scores(results)).containsExactly(2.0);
        assertThat(rank("someone@else.org", owner, otherOmar)).isEmpty();
        // An address is one word, so a misspelled one is a close spelling of the owner's.
        assertThat(rank("omar.naser@example.org", owner, otherOmar)).extracting(SearchResult::id)
                .containsExactly(owner.getId());
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
        assertThat(scores(rank("safaa", safaa))).containsExactly(5.0);
        assertThat(scores(rank("safa'a", safaa))).containsExactly(5.0);
    }

    @Test
    void findsACompoundNameWithOrWithoutItsSpace() {
        Trainee compound = trainee(null, "Abdulrahman", "Saleh", 50);
        Trainee split = trainee(null, "Abdul", "Rahman", 50);

        assertThat(scores(rank("abdulrahman", compound, split))).containsExactly(5.0, 5.0);
        assertThat(scores(rank("abdul rahman", compound, split))).containsExactly(10.0, 10.0);
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

    // ------------------------------------------------------------------ volunteers

    @Test
    void findsAVolunteerByNameCompanyAndJobRole() {
        Volunteer jane = Volunteer.builder().id("jane").firstName("Jane").lastName("Roe").companyName("Adyen")
                .jobRole("Recruiter").pictureId("IMGface").build();

        assertThat(rank("jane", List.of(), List.of(jane), List.of(), List.of())).singleElement().satisfies(result -> {
            assertThat(result.type()).isEqualTo(SearchResultType.VOLUNTEER);
            assertThat(result.title()).isEqualTo("Jane Roe");
            assertThat(result.subtitle()).isEqualTo("Volunteer");
            assertThat(result.thumbnailUrl()).isEqualTo("/api/volunteers/jane/picture/IMGface/thumbnail");
            assertThat(result.path()).isEqualTo("/volunteer/jane-roe_jane");
            assertThat(result.score()).isEqualTo(5.0);
        });
        assertThat(scores(rank("adyen", List.of(), List.of(jane), List.of(), List.of()))).containsExactly(1.0);
        assertThat(scores(rank("recruiter", List.of(), List.of(jane), List.of(), List.of())))
                .containsExactly(1.0);
    }

    @Test
    void findsAVolunteerByEmailAndGithubHandle() {
        Volunteer jane = Volunteer.builder().id("jane").firstName("Jane").lastName("Roe").email("jroe@example.org")
                .githubHandle("jroe").build();

        assertThat(scores(rank("jroe@example.org", List.of(), List.of(jane), List.of(), List.of())))
                .containsExactly(2.0);
        assertThat(scores(rank("jroe", List.of(), List.of(jane), List.of(), List.of()))).containsExactly(1.0);
    }

    @Test
    void breaksVolunteerTiesByDisplayNameThenId() {
        Volunteer zaki = Volunteer.builder().id("a").firstName("Mariam").lastName("Zaki").build();
        Volunteer aziz = Volunteer.builder().id("b").firstName("Mariam").lastName("Aziz").build();
        Volunteer sameNameLaterId = Volunteer.builder().id("d").firstName("Mariam").lastName("Aziz").build();
        Volunteer sameNameEarlierId = Volunteer.builder().id("c").firstName("Mariam").lastName("Aziz").build();

        assertThat(rank("mariam", List.of(), List.of(zaki, sameNameLaterId, aziz, sameNameEarlierId), List.of(),
                List.of())).extracting(SearchResult::id).containsExactly("b", "c", "d", "a");
    }

    // ------------------------------------------------------------------ organisations and contact persons

    @Test
    void findsAnOrganisationByACloseSpellingOfItsName() {
        Organisation adyen = Organisation.builder().id("adyen").name("Adyen").pictureId("IMGlogo").build();

        List<SearchResult> results = rank("adyn", List.of(), List.of(), List.of(adyen), List.of());

        assertThat(results).singleElement().satisfies(result -> {
            assertThat(result.type()).isEqualTo(SearchResultType.ORGANISATION);
            assertThat(result.title()).isEqualTo("Adyen");
            assertThat(result.subtitle()).isEqualTo("Organisation");
            assertThat(result.thumbnailUrl()).isEqualTo("/api/organisations/adyen/picture/IMGlogo/thumbnail");
            assertThat(result.path()).isEqualTo("/organisation/adyen_adyen");
        });
        assertThat(scores(results)).containsExactly(0.002);
    }

    @Test
    void findsAnOrganisationByItsWebsite() {
        Organisation adyen = Organisation.builder().id("adyen").name("Adyen").websiteUrl("https://www.adyen.com/")
                .build();

        assertThat(scores(rank("https://www.adyen.com", List.of(), List.of(), List.of(adyen), List.of())))
                .containsExactly(12.0);
        assertThat(rank("adyen.com", List.of(), List.of(), List.of(adyen), List.of())).extracting(SearchResult::id)
                .containsExactly("adyen");
    }

    @Test
    void findsDottedOrganisationNamesWithOrWithoutTheDots() {
        Organisation coolblue = Organisation.builder().id("coolblue").name("Coolblue B.V.").build();
        Organisation booking = Organisation.builder().id("booking").name("Booking.com").build();
        List<Organisation> organisations = List.of(coolblue, booking);

        assertThat(scores(rank("coolblue bv", List.of(), List.of(), organisations, List.of())))
                .containsExactly(10.0);
        assertThat(scores(rank("coolblue b.v.", List.of(), List.of(), organisations, List.of())))
                .containsExactly(15.0);
        assertThat(scores(rank("booking com", List.of(), List.of(), organisations, List.of())))
                .containsExactly(10.0);
        assertThat(scores(rank("booking.com", List.of(), List.of(), organisations, List.of())))
                .containsExactly(10.0);
        // The name starts with "booking", a word of it is not a match of its own.
        assertThat(scores(rank("booking", List.of(), List.of(), organisations, List.of()))).containsExactly(0.5);
    }

    @Test
    void aContactPersonOpensTheirOrganisation() {
        Organisation acme = Organisation.builder().id("acme").name("Acme").build();
        ContactPerson jane = ContactPerson.builder().id("jane").organisationId("acme").name("Jane Roe")
                .jobTitle("Recruiter").build();

        assertThat(rank("roe", List.of(), List.of(), List.of(acme), List.of(jane))).singleElement()
                .satisfies(result -> {
                    assertThat(result.type()).isEqualTo(SearchResultType.CONTACT_PERSON);
                    assertThat(result.subtitle()).isEqualTo("Acme");
                    assertThat(result.thumbnailUrl()).isNull();
                    assertThat(result.path()).isEqualTo(acme.getProfilePath());
                });
    }

    @Test
    void findsAContactPersonByNameAndOrganisation() {
        Organisation acme = Organisation.builder().id("acme").name("Acme").build();
        ContactPerson jane = ContactPerson.builder().id("jane").organisationId("acme").name("Jane Roe").build();
        ContactPerson john = ContactPerson.builder().id("john").organisationId("acme").name("John Roe").build();

        assertThat(rank("jane acme", List.of(), List.of(), List.of(acme), List.of(john, jane)))
                .extracting(SearchResult::id).containsExactly("jane");
    }

    @Test
    void findsAContactPersonByJobTitleAndEmail() {
        Organisation acme = Organisation.builder().id("acme").name("Acme").build();
        ContactPerson jane = ContactPerson.builder().id("jane").organisationId("acme").name("Jane Roe")
                .email("jane@acme.example").jobTitle("Recruiter").build();

        assertThat(scores(rank("recruiter", List.of(), List.of(), List.of(acme), List.of(jane))))
                .containsExactly(1.0);
        assertThat(scores(rank("jane@acme.example", List.of(), List.of(), List.of(acme), List.of(jane))))
                .containsExactly(2.0);
    }

    // ------------------------------------------------------------------ merging

    @Test
    void equalScoresPutTraineesBeforeVolunteersBeforeOrganisationsBeforeContactPersons() {
        // Named Haddad, the first of each ties the organisation; with Haddad as last name, the second ties the contact,
        // whose name weighs 3.
        Trainee firstName = trainee(null, "Haddad", "Aziz", 50);
        Trainee lastName = trainee(null, "Omar", "Haddad", 50);
        Volunteer volunteerFirstName = Volunteer.builder().id("v-first").firstName("Haddad").lastName("Aziz").build();
        Volunteer volunteerLastName = Volunteer.builder().id("v-last").firstName("Omar").lastName("Haddad").build();
        Organisation organisation = Organisation.builder().id("haddad").name("Haddad").build();
        ContactPerson contactPerson = ContactPerson.builder().id("contact").organisationId("haddad")
                .name("Haddad").build();
        // A mention in the notes ties an organisation with a contact person.
        Organisation notedOrganisation = Organisation.builder().id("noted").name("Acme").notes("Founded by Haddad")
                .build();
        ContactPerson notedContact = ContactPerson.builder().id("noted-contact").organisationId("noted")
                .name("Jane Roe").notes("Colleague of Haddad").build();

        List<SearchResult> results = rank("haddad", List.of(lastName, firstName),
                List.of(volunteerLastName, volunteerFirstName), List.of(notedOrganisation, organisation),
                List.of(notedContact, contactPerson));

        assertThat(results).extracting(SearchResult::type).containsExactly(SearchResultType.TRAINEE,
                SearchResultType.VOLUNTEER, SearchResultType.ORGANISATION, SearchResultType.TRAINEE,
                SearchResultType.VOLUNTEER, SearchResultType.CONTACT_PERSON, SearchResultType.ORGANISATION,
                SearchResultType.CONTACT_PERSON);
        assertThat(scores(results)).containsExactly(5.0, 5.0, 5.0, 3.0, 3.0, 3.0, 0.00004, 0.00004);
    }

    // ------------------------------------------------------------------ scoring fields

    @Test
    void aBetterKindOfMatchBeatsABetterField() {
        assertThat(score("omar", new Field("Omar", 1))).isEqualTo(1);
        assertThat(score("omar", new Field("Omari", 5))).isEqualTo(0.5);
        // A later word's start in a name beats a start in a weight-1 field.
        assertThat(score("berg", new Field("Jan van der Berg", 5)))
                .isGreaterThan(score("berg", new Field("Bergen Consulting", 1)));
    }

    @Test
    void anAddressIsMatchedAsTyped() {
        assertThat(score("@adyen.com", new Field("jane@adyen.com", 2))).isEqualTo(0.02);
    }

    @Test
    void everyWordMustMatchSomeFieldInAnyOrder() {
        assertThat(score("mariam haddad", new Field("Mariam", 5))).isZero();
        assertThat(score("mariam haddad", new Field("Mariam", 5), new Field("Haddad", 3))).isEqualTo(8);
        assertThat(score("haddad mariam", new Field("Mariam", 5), new Field("Haddad", 3))).isEqualTo(8);
        assertThat(score("mariam h", new Field("Mariam", 5), new Field("Haddad", 3))).isEqualTo(5.3);
        assertThat(score("mariam hadad", new Field("Mariam", 5), new Field("Haddad", 3))).isBetween(5.0, 5.003);
    }

    @Test
    void theWholeQueryInOneFieldCountsForEveryWord() {
        assertThat(score("abdul rahman", new Field("Abdulrahman", 5))).isEqualTo(10);
        assertThat(score("op zand", new Field("Loon op Zand", 1))).isEqualTo(0.08);
        // A start without the space is just a start: "sam i" is Sam Ibrahim before Samira.
        assertThat(score("sam i", new Field("Sam", 5), new Field("Ibrahim", 3))).isEqualTo(5.3);
        assertThat(score("sam i", new Field("Samira", 5))).isEqualTo(1);
    }

    @Test
    void aTypoCostsMoreThanTheNameWeightsDiffer() {
        // One typo in a last name beats two in a first name.
        assertThat(score("hadad", new Field("Haddad", 3))).isGreaterThan(score("hadad", new Field("Fahad", 5)));
    }

    @Test
    void aNoteRanksBelowANameWithTypos() {
        double note = score("yusuf", new Field("Referred by Yusuf.", 0.001));
        double transliteratedName = score("yusuf", new Field("Youssef", 3));
        double partOfName = score("rahman", new Field("Abdulrahman", 3));

        assertThat(note).isEqualTo(0.00004);
        assertThat(transliteratedName).isGreaterThan(note);
        assertThat(partOfName).isEqualTo(0.03);
    }

    @Test
    void emptyFieldsNeverMatch() {
        assertThat(score("mariam", new Field(null, 5), new Field("", 1))).isZero();
    }

    // ------------------------------------------------------------------ helpers

    private static double score(String query, Field... fields) {
        return Math.round(SearchService.score(List.of(fields), query) * 1e6) / 1e6;
    }

    private static List<SearchResult> rank(String query, List<Trainee> trainees, List<Volunteer> volunteers,
            List<Organisation> organisations, List<ContactPerson> contactPersons) {
        return SearchService.rank(trainees, volunteers, organisations, contactPersons, query);
    }

    private static List<SearchResult> rank(String query, Trainee... trainees) {
        return SearchService.rankTrainees(List.of(trainees), query);
    }

    // Close spellings and notes score tiny fractions, so compare to six decimals.
    private static List<Double> scores(List<SearchResult> results) {
        return results.stream().map(result -> Math.round(result.score() * 1e6) / 1e6).toList();
    }

    private static Trainee trainee(String preferredName, String firstName, String lastName, Integer cohort) {
        String id = firstName + "-" + lastName + "-" + cohort;
        return Trainee.builder().id(id).preferredName(preferredName).firstName(firstName).lastName(lastName)
                .currentCohort(cohort).build();
    }
}
