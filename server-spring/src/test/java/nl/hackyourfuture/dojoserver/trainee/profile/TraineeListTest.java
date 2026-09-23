package nl.hackyourfuture.dojoserver.trainee.profile;

import static org.assertj.core.api.Assertions.assertThat;

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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private TraineeRepository traineeRepository;
    @Autowired
    private AssessmentRepository assessmentRepository;

    private Trainee earlier;
    private Trainee later;
    private Trainee noCohort;

    @BeforeEach
    void givenThreeTrainees() {
        earlier = traineeRepository.save(trainee("Ann", "Earlier", EARLIER_COHORT));
        later = traineeRepository.save(trainee("Bob", "Later", LATER_COHORT));
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

    // ------------------------------------------------------------------ paging

    @Test
    void anOutOfRangePageIsEmptyButStillCounts() {
        MvcTestResult beyondTheEnd = list("?startCohort=9000&endCohort=9999&page=9999&size=25");

        assertThat(beyondTheEnd).bodyJson().extractingPath("$.content").asArray().isEmpty();
        assertThat(beyondTheEnd).bodyJson().extractingPath("$.page.totalElements").isEqualTo(2);
    }

    @Test
    void pagingParametersOutOfBoundsAreRejected() {
        assertThat(list("?size=9999")).hasStatus(400);
        assertThat(list("?size=0")).hasStatus(400);
        assertThat(list("?page=-1")).hasStatus(400);
    }

    // ------------------------------------------------------------------ helpers

    private MvcTestResult list(String query) {
        return mvc.get().uri(TRAINEES + query).exchange();
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
