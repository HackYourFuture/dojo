package nl.hackyourfuture.dojoserver.search;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.shared.RandomUtils;
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
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

/**
 * Search over MockMvc, against the local development database, so transactional. Every query includes a random last
 * name that only the seeded trainees share, so real trainees never show up in the results.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class SearchEndpointTest {
    private static final String SEARCH = "/api/search";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private TraineeRepository traineeRepository;

    private String lastName;
    private Trainee mariam;
    private Trainee maryam;

    @BeforeEach
    void givenTwoTraineesWithTheSameRandomLastName() {
        lastName = RandomUtils.generateRandomId();
        mariam = traineeRepository.save(trainee("Mariam", 52));
        maryam = traineeRepository.save(trainee("Maryam", 50));
    }

    @Test
    void returnsTheBestMatchFirst() {
        MvcTestResult result = search("mariam " + lastName);

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(mariam.getId(), maryam.getId());
        assertThat(result).bodyJson().extractingPath("$[0].type").isEqualTo("trainee");
        assertThat(result).bodyJson().extractingPath("$[0].title").isEqualTo(mariam.getDisplayName());
        assertThat(result).bodyJson().extractingPath("$[0].subtitle").isEqualTo("Cohort 52");
        assertThat(result).bodyJson().extractingPath("$[0].path").isEqualTo(mariam.getProfilePath());
        assertThat(result).bodyJson().extractingPath("$[0].score").isEqualTo(8000.0);
    }

    @Test
    void returnsNothingForAQueryShorterThanTwoCharacters() {
        assertThat(search("m")).hasStatusOk().bodyJson().isEqualTo("[]");
    }

    @Test
    void rejectsAMissingQuery() {
        assertThat(mvc.get().uri(SEARCH)).hasStatus(400);
    }

    @Test
    void rejectsAQueryLongerThanOneHundredCharacters() {
        assertThat(search("m".repeat(101))).hasStatus(400);
    }

    @Test
    @WithAnonymousUser
    void needsASignedInUser() {
        assertThat(search("mariam")).hasStatus(401);
    }

    private MvcTestResult search(String query) {
        return mvc.get().uri(SEARCH).param("q", query).exchange();
    }

    private Trainee trainee(String firstName, Integer cohort) {
        return Trainee.builder()
                .id(RandomUtils.generateRandomId())
                .firstName(firstName)
                .lastName(lastName)
                .email(RandomUtils.generateRandomId() + "@example.org")
                .startCohort(cohort)
                .currentCohort(cohort)
                .track(Track.CORE_PROGRAM)
                .learningStatus(LearningStatus.STUDYING)
                .jobPath(JobPath.NOT_GRADUATED)
                .build();
    }
}
