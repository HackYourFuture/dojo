package nl.hackyourfuture.dojoserver.dashboard;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.trainee.profile.EducationLevel;
import nl.hackyourfuture.dojoserver.trainee.profile.Gender;
import nl.hackyourfuture.dojoserver.trainee.profile.JobPath;
import nl.hackyourfuture.dojoserver.trainee.profile.LearningStatus;
import nl.hackyourfuture.dojoserver.trainee.profile.Track;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

// The dashboard over MockMvc, against the local database. The seeded cohorts are far outside the real ones.
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
public class DashboardEndpointTest {

    private static final String COHORT_9001 = "/api/dashboard?startCohort=9001&endCohort=9001";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private TraineeRepository traineeRepository;

    @BeforeEach
    void givenTrainees() {
        save(trainee(9001).track(Track.FRONTEND).countryOfOrigin("Syria").gender(Gender.WOMAN)
                .educationLevel(EducationLevel.BACHELORS_DEGREE));
        save(trainee(9001).track(Track.FRONTEND).countryOfOrigin(" syria ").gender(Gender.MAN)
                .educationLevel(EducationLevel.BACHELORS_DEGREE));
        save(trainee(9001).learningStatus(LearningStatus.GRADUATED).jobPath(JobPath.SEARCHING)
                .track(Track.BACKEND).countryOfOrigin("Eritrea").educationLevel(EducationLevel.HIGH_SCHOOL));
        save(trainee(9001).learningStatus(LearningStatus.GRADUATED).jobPath(JobPath.TECH_JOB)
                .countryOfOrigin("Eritrea").gender(Gender.MAN));
        save(trainee(9001).learningStatus(LearningStatus.GRADUATED).jobPath(JobPath.NON_TECH_JOB)
                .countryOfOrigin("Syria").gender(Gender.WOMAN));
        save(trainee(9001).learningStatus(LearningStatus.QUIT).gender(Gender.WOMAN));
        save(trainee(9001).learningStatus(LearningStatus.ON_HOLD).track(Track.BACKEND).countryOfOrigin("Syria")
                .gender(Gender.MAN).educationLevel(EducationLevel.HIGH_SCHOOL));
        save(trainee(9002).track(Track.DATA).countryOfOrigin("Ukraine").gender(Gender.MAN));
    }

    @Test
    void countsTheOverview() {
        var json = assertThat(get(COHORT_9001)).bodyJson();
        json.extractingPath("$.overview.studying").isEqualTo(2);
        json.extractingPath("$.overview.onHold").isEqualTo(1);
        json.extractingPath("$.overview.searching").isEqualTo(1);
        json.extractingPath("$.overview.active").isEqualTo(4);
        json.extractingPath("$.overview.workingInIt").isEqualTo(1);
        json.extractingPath("$.overview.leftWithoutItJob").isEqualTo(2);
        json.extractingPath("$.overview.total").isEqualTo(7);
    }

    @Test
    void countsLearningStatusesInEnumOrder() {
        var json = assertThat(get(COHORT_9001)).bodyJson();
        json.extractingPath("$.learningStatuses[*].status").asArray()
                .containsExactly("studying", "graduated", "on-hold", "quit");
        json.extractingPath("$.learningStatuses[*].count").asArray().containsExactly(2, 3, 1, 1);
    }

    @Test
    void countsOnlyTracksWithTrainees() {
        var json = assertThat(get(COHORT_9001)).bodyJson();
        json.extractingPath("$.tracks[*].track").asArray().containsExactly("core-program", "frontend", "backend");
        json.extractingPath("$.tracks[*].count").asArray().containsExactly(3, 2, 2);
    }

    @Test
    void countsEducationLevelsWithNotSetLast() {
        var json = assertThat(get(COHORT_9001)).bodyJson();
        json.extractingPath("$.educationLevels[*].educationLevel").asArray()
                .containsExactly("high-school", "bachelors-degree", null);
        json.extractingPath("$.educationLevels[*].count").asArray().containsExactly(2, 2, 3);
    }

    @Test
    void mergesCountrySpellingsAndPutsTheLargestFirst() {
        var json = assertThat(get(COHORT_9001)).bodyJson();
        json.extractingPath("$.countries[*].country").asArray().containsExactly("Syria", "Eritrea", null);
        json.extractingPath("$.countries[*].count").asArray().containsExactly(4, 2, 1);
    }

    @Test
    void countsGendersWithNotSetLast() {
        var json = assertThat(get(COHORT_9001)).bodyJson();
        json.extractingPath("$.genders[*].gender").asArray().containsExactly("man", "woman", null);
        json.extractingPath("$.genders[*].count").asArray().containsExactly(3, 3, 1);
    }

    @Test
    void theCohortRangeIncludesBothEnds() {
        assertThat(get("/api/dashboard?startCohort=9001&endCohort=9002")).bodyJson()
                .extractingPath("$.overview.total").isEqualTo(8);
    }

    @Test
    void aMissingEndCohortLeavesTheRangeOpen() {
        assertThat(get("/api/dashboard?startCohort=9002")).bodyJson()
                .extractingPath("$.overview.total").isEqualTo(1);
    }

    @Test
    void aTraineeCountsInItsCurrentCohortOrElseItsStartCohort() {
        save(trainee(9003).currentCohort(null));
        save(trainee(9003).currentCohort(9004));
        assertThat(get("/api/dashboard?startCohort=9003&endCohort=9003")).bodyJson()
                .extractingPath("$.overview.total").isEqualTo(1);
    }

    @Test
    void aRangeWithoutTraineesCountsNothing() {
        var json = assertThat(get("/api/dashboard?startCohort=9003&endCohort=9004")).bodyJson();
        json.extractingPath("$.overview.total").isEqualTo(0);
        json.extractingPath("$.learningStatuses").asArray().isEmpty();
        json.extractingPath("$.countries").asArray().isEmpty();
        json.extractingPath("$.genders").asArray().isEmpty();
    }

    private MvcTestResult get(String uri) {
        return mvc.get().uri(uri).exchange();
    }

    // A studying core-program trainee; each seed overrides what it needs.
    private static Trainee.TraineeBuilder trainee(int cohort) {
        return Trainee.builder()
                .id(RandomUtils.generateRandomId())
                .firstName("Dash")
                .lastName("Board")
                .email(RandomUtils.generateRandomId() + "@example.org")
                .startCohort(cohort)
                .currentCohort(cohort)
                .track(Track.CORE_PROGRAM)
                .learningStatus(LearningStatus.STUDYING)
                .jobPath(JobPath.NOT_GRADUATED);
    }

    private void save(Trainee.TraineeBuilder trainee) {
        traineeRepository.save(trainee.build());
    }
}
