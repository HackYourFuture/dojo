package nl.hackyourfuture.dojoserver.trainee.profile;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.geo.City;
import nl.hackyourfuture.dojoserver.geo.CityRepository;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.trainee.assessment.Assessment;
import nl.hackyourfuture.dojoserver.trainee.assessment.AssessmentRepository;
import nl.hackyourfuture.dojoserver.trainee.assessment.AssessmentResult;
import nl.hackyourfuture.dojoserver.trainee.assessment.AssessmentType;
import org.assertj.core.api.InstanceOfAssertFactories;
import org.assertj.core.api.ObjectArrayAssert;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

/**
 * The trainee list over MockMvc. Transactional, because it runs against the local development
 * database. The seeded cohorts are far outside the real ones so the filtered assertions see only
 * these trainees.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
public class TraineeListTest {

    private static final String TRAINEES = "/api/trainees";
    private static final int EARLIER_COHORT = 9001;
    private static final int LATER_COHORT = 9002;
    private static final String SEEDED_COHORTS = "?startCohort=9001&endCohort=9002";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private TraineeRepository traineeRepository;
    @Autowired
    private AssessmentRepository assessmentRepository;
    @Autowired
    private CityRepository cityRepository;

    private Trainee earlier;
    private Trainee later;
    private Trainee noCohort;

    @BeforeEach
    void givenThreeTrainees() {
        earlier = traineeRepository.save(trainee("Ann", "Earlier", EARLIER_COHORT));
        later = trainee("Bob", "Later", LATER_COHORT);
        later.setLearningStatus(LearningStatus.ON_HOLD);
        later.setJobPath(JobPath.SEARCHING);
        later = traineeRepository.save(later);
        noCohort = traineeRepository.save(trainee("Cam", "Nocohort", null));
    }

    // ------------------------------------------------------------------ sorting

    @Test
    void traineesWithNoCohortComeFirstAscending() {
        assertThat(list("?direction=ASC&size=1")).bodyJson()
                .extractingPath("$.content[0].cohort").isNull();
    }

    @Test
    void traineesWithNoCohortComeFirstDescendingToo() {
        assertThat(list("?direction=DESC&size=1")).bodyJson()
                .extractingPath("$.content[0].cohort").isNull();
    }

    @Test
    void theDirectionReversesTheCohortOrder() {
        ids("?startCohort=9000&endCohort=9999&direction=ASC")
                .containsExactly(earlier.getId(), later.getId());
        ids("?startCohort=9000&endCohort=9999&direction=DESC")
                .containsExactly(later.getId(), earlier.getId());
    }

    @Test
    void theDirectionIsRejectedUnlessItIsAscOrDescInCapitals() {
        assertThat(list("?direction=sideways")).hasStatus(400);
        assertThat(list("?direction=desc")).hasStatus(400);
    }

    // ------------------------------------------------------------------ filtering

    @Test
    void theCohortRangeIsInclusiveAtBothEnds() {
        ids("?startCohort=9001&endCohort=9001").containsExactly(earlier.getId());
        ids("?startCohort=9002&endCohort=9002").containsExactly(later.getId());
        ids("?startCohort=9001&endCohort=9002").containsExactly(earlier.getId(), later.getId());
    }

    @Test
    void aRangeExcludesTheTraineesWithNoCohort() {
        ids("?startCohort=9000&endCohort=9999").doesNotContain(noCohort.getId());
    }

    @Test
    void aStatusIsGivenByItsConstantName() {
        ids(SEEDED_COHORTS + "&status=ON_HOLD").containsExactly(later.getId());
        assertThat(list(SEEDED_COHORTS + "&status=on-hold")).hasStatus(400);
    }

    @Test
    void repeatedStatusesMatchAnyOfThem() {
        ids(SEEDED_COHORTS + "&status=ON_HOLD&status=STUDYING").containsExactly(earlier.getId(), later.getId());
        ids(SEEDED_COHORTS + "&status=ON_HOLD,STUDYING").containsExactly(earlier.getId(), later.getId());
        ids(SEEDED_COHORTS + "&status=QUIT").isEmpty();
    }

    @Test
    void repeatedJobPathsMatchAnyOfThem() {
        ids(SEEDED_COHORTS + "&jobPath=SEARCHING").containsExactly(later.getId());
        ids(SEEDED_COHORTS + "&jobPath=SEARCHING&jobPath=NOT_GRADUATED")
                .containsExactly(earlier.getId(), later.getId());
    }

    @Test
    void theProvinceIsTheOneOfTheCity() {
        City city = cityRepository.save(city());
        earlier.setCity(city);
        traineeRepository.save(earlier);

        ids(SEEDED_COHORTS + "&province=" + city.getProvince()).containsExactly(earlier.getId());
        ids(SEEDED_COHORTS + "&province=Elsewhere&province=" + city.getProvince())
                .containsExactly(earlier.getId());
    }

    @Test
    void searchWordsKeepTheCohortOrder() {
        later.setPreferredName("Ann");
        traineeRepository.save(later);

        ids(SEEDED_COHORTS + "&q=ann&direction=ASC").containsExactly(earlier.getId(), later.getId());
        ids(SEEDED_COHORTS + "&q=ann&direction=DESC").containsExactly(later.getId(), earlier.getId());
    }

    @Test
    void searchWordsMatchLikeTheSearch() {
        ids(SEEDED_COHORTS + "&q=ann earlier").containsExactly(earlier.getId());
        ids(SEEDED_COHORTS + "&q=erlier").containsExactly(earlier.getId());
        ids(SEEDED_COHORTS + "&q= ").containsExactly(earlier.getId(), later.getId());
    }

    @Test
    void searchWordsThatMatchNoTraineeLeaveAnEmptyPage() {
        MvcTestResult result = list(SEEDED_COHORTS + "&q=xyzzy");

        assertThat(result).bodyJson().extractingPath("$.content").asArray().isEmpty();
        assertThat(result).bodyJson().extractingPath("$.page.totalElements").isEqualTo(0);
    }

    @Test
    void everyFilterMustMatch() {
        ids(SEEDED_COHORTS + "&q=earlier&status=STUDYING").containsExactly(earlier.getId());
        ids(SEEDED_COHORTS + "&q=earlier&status=ON_HOLD").isEmpty();
        ids(SEEDED_COHORTS + "&status=ON_HOLD&jobPath=NOT_GRADUATED").isEmpty();
    }

    // ------------------------------------------------------------------ average score

    @Test
    void theAverageIsTheMeanOfTheBestScorePerType() {
        // A retake of the same type replaces its earlier attempt, so this is (8 + 6) / 2, not (4 + 8 + 6) / 3.
        score(earlier, AssessmentType.JAVASCRIPT, "4.0");
        score(earlier, AssessmentType.JAVASCRIPT, "8.0");
        score(earlier, AssessmentType.NODEJS, "6.0");

        assertThat(list("?startCohort=9001&endCohort=9001")).bodyJson()
                .extractingPath("$.content[0].averageAssessmentScore")
                .convertTo(InstanceOfAssertFactories.BIG_DECIMAL).isEqualByComparingTo("7.0");
    }

    @Test
    void anUnscoredAssessmentDoesNotCount() {
        score(earlier, AssessmentType.JAVASCRIPT, "8.0");
        score(earlier, AssessmentType.NODEJS, null);

        assertThat(list("?startCohort=9001&endCohort=9001")).bodyJson()
                .extractingPath("$.content[0].averageAssessmentScore")
                .convertTo(InstanceOfAssertFactories.BIG_DECIMAL).isEqualByComparingTo("8.0");
    }

    @Test
    void aTraineeWithoutScoresCarriesANullAverage() {
        assertThat(list("?startCohort=9001&endCohort=9001")).bodyJson()
                .extractingPath("$.content[0]").asMap()
                .containsEntry("averageAssessmentScore", null);
    }

    @Test
    void theAssessmentsCarryTheSameAverage() {
        score(earlier, AssessmentType.JAVASCRIPT, "4.0");
        score(earlier, AssessmentType.JAVASCRIPT, "8.0");
        score(earlier, AssessmentType.NODEJS, "6.5");

        MvcTestResult result = assessments(earlier);
        assertThat(result).bodyJson().extractingPath("$.assessments").asArray().hasSize(3);
        assertThat(result).bodyJson()
                .extractingPath("$.averageScore")
                .convertTo(InstanceOfAssertFactories.BIG_DECIMAL).isEqualByComparingTo("7.25");
    }

    @Test
    void theAssessmentsOfATraineeWithoutScoresCarryANullAverage() {
        assertThat(assessments(earlier)).bodyJson()
                .extractingPath("$").asMap()
                .containsEntry("averageScore", null);
    }

    // ------------------------------------------------------------------ city

    @Test
    void theCityIsEmbeddedAndNullWithoutOne() {
        City city = cityRepository.save(city());
        earlier.setCity(city);
        traineeRepository.save(earlier);

        MvcTestResult result = list(SEEDED_COHORTS);
        assertThat(result).bodyJson().extractingPath("$.content[0].city.id").isEqualTo(city.getId());
        assertThat(result).bodyJson().extractingPath("$.content[0].city.name").isEqualTo(city.getName());
        assertThat(result).bodyJson().extractingPath("$.content[1]").asMap().containsEntry("city", null);
    }

    // ------------------------------------------------------------------ paging

    @Test
    void anOutOfRangePageIsEmptyButStillCounts() {
        MvcTestResult beyondTheEnd = list("?startCohort=9000&endCohort=9999&page=9999&size=25");

        assertThat(beyondTheEnd).bodyJson().extractingPath("$.content").asArray().isEmpty();
        assertThat(beyondTheEnd).bodyJson().extractingPath("$.page.totalElements").isEqualTo(2);
    }

    @Test
    void theMapGetsEveryTraineeInOnePage() {
        MvcTestResult everything = list("?startCohort=9000&endCohort=9999&size=5000");

        assertThat(everything).hasStatusOk();
        assertThat(everything).bodyJson().extractingPath("$.content").asArray().hasSize(2);
    }

    @Test
    void pagingParametersOutOfBoundsAreRejected() {
        assertThat(list("?size=9999")).hasStatus(400);
        assertThat(list("?size=0")).hasStatus(400);
        assertThat(list("?page=-1")).hasStatus(400);
    }

    // ------------------------------------------------------------------ export

    @Test
    void theExportIsACsvDownloadNamedByTheDay() {
        MvcTestResult result = export(SEEDED_COHORTS);

        assertThat(result).hasStatusOk();
        assertThat(result).hasContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
        assertThat(result).headers().hasValue("Content-Disposition",
                "attachment; filename=\"dojo-export-trainees-" + LocalDate.now() + ".csv\"");
        assertThat(csv(result)).startsWith("\uFEFFFirst name,Last name,Preferred name,Gender,Pronouns,Date of birth,"
                + "Email,Phone,Slack ID,GitHub handle,LinkedIn URL,City,Province,Country of origin,Background,"
                + "NL arrival date,First permit issue date,English level,Professional Dutch,Financial support,"
                + "Education level,Education background,Weekly work hours,Has car,Start cohort,Current cohort,Track,"
                + "Learning status,Start date,Graduation date,Certificate ID,Quit date,Quit reason,Job path,"
                + "Job support end date,ESF ID,Comments\r\n");
    }

    @Test
    void theExportHoldsEveryTraineeTheFiltersMatchInTheOrderOfTheList() {
        String[] descending = csv(export(SEEDED_COHORTS + "&direction=DESC")).split("\r\n");
        assertThat(descending).hasSize(3);
        assertThat(descending[1]).startsWith("Bob,Later,");
        assertThat(descending[2]).startsWith("Ann,Earlier,");

        String[] studying = csv(export(SEEDED_COHORTS + "&status=STUDYING")).split("\r\n");
        assertThat(studying).hasSize(2);
        assertThat(studying[1]).startsWith("Ann,Earlier,");

        assertThat(csv(export(SEEDED_COHORTS + "&q=xyzzy")).split("\r\n")).hasSize(1);
    }

    @Test
    void theExportNamesTheCityAndItsProvince() {
        City city = cityRepository.save(city());
        earlier.setCity(city);
        traineeRepository.save(earlier);

        String[] lines = csv(export("?startCohort=9001&endCohort=9001")).split("\r\n");
        assertThat(lines[1]).contains("," + city.getName() + "," + city.getProvince() + ",");
    }

    @Test
    void theExportReadsLikeTheProfileAndQuotesWhatItHasTo() {
        later.setComments("Likes \"tea\", coffee\nand cake");
        later.setProfessionalDutch(true);
        later.setStartDate(LocalDate.of(2026, 1, 5));
        traineeRepository.save(later);

        String file = csv(export("?startCohort=9002&endCohort=9002"));
        assertThat(file.split("\r\n")).hasSize(2);
        assertThat(file).contains(",On hold,", ",Searching,", ",Yes,", ",2026-01-05,",
                "\"Likes \"\"tea\"\", coffee\nand cake\"");
    }

    @Test
    void theExportRejectsABadParameterWithTheUsualError() {
        MvcTestResult result = export("?direction=sideways");

        assertThat(result).hasStatus(400);
        assertThat(result).bodyJson().extractingPath("$.error").isNotNull();
    }

    // ------------------------------------------------------------------ helpers

    private MvcTestResult list(String query) {
        return mvc.get().uri(TRAINEES + query).exchange();
    }

    private MvcTestResult export(String query) {
        return mvc.get().uri(TRAINEES + "/export" + query).exchange();
    }

    // The body decoded as the UTF-8 it is declared as.
    private static String csv(MvcTestResult result) {
        return new String(result.getResponse().getContentAsByteArray(), StandardCharsets.UTF_8);
    }

    private MvcTestResult assessments(Trainee trainee) {
        return mvc.get().uri(TRAINEES + "/{id}/assessments", trainee.getId()).exchange();
    }

    private ObjectArrayAssert<Object> ids(String query) {
        return assertThat(list(query)).bodyJson().extractingPath("$.content[*].id").asArray();
    }

    private Trainee trainee(String firstName, String lastName, Integer cohort) {
        return Trainee.builder()
                .id(RandomUtils.generateRandomId())
                .firstName(firstName)
                .lastName(lastName)
                .email(RandomUtils.generateRandomId() + "@example.org")
                .startCohort(EARLIER_COHORT)
                .currentCohort(cohort)
                .track(Track.CORE_PROGRAM)
                .learningStatus(LearningStatus.STUDYING)
                .jobPath(JobPath.NOT_GRADUATED)
                .build();
    }

    // Its province is as unique as its id, so only the seeded trainees can be in it.
    private static City city() {
        String id = RandomUtils.generateRandomId();
        return City.builder()
                .id(id)
                .name("Stad " + id)
                .population(1)
                .province("Provincie" + id)
                .region("Midden-Utrecht")
                .latitude(52.09)
                .longitude(5.12)
                .build();
    }

    private void score(Trainee trainee, AssessmentType type, String score) {
        assessmentRepository.save(Assessment.builder()
                .id(RandomUtils.generateRandomId())
                .traineeId(trainee.getId())
                .date(LocalDate.now())
                .type(type)
                .result(AssessmentResult.PASSED)
                .score(score == null ? null : new BigDecimal(score))
                .build());
    }
}
