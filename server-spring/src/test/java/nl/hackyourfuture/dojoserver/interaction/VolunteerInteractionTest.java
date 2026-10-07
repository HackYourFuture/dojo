package nl.hackyourfuture.dojoserver.interaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.verify;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.authentication.token.TokenService;
import nl.hackyourfuture.dojoserver.authentication.token.TokenType;
import nl.hackyourfuture.dojoserver.filestorage.FileStorageService;
import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;
import nl.hackyourfuture.dojoserver.partner.organisation.OrganisationRepository;
import nl.hackyourfuture.dojoserver.partner.organisation.OrganisationStatus;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.slack.SlackClient;
import nl.hackyourfuture.dojoserver.trainee.profile.JobPath;
import nl.hackyourfuture.dojoserver.trainee.profile.LearningStatus;
import nl.hackyourfuture.dojoserver.trainee.profile.Track;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import nl.hackyourfuture.dojoserver.volunteer.Volunteer;
import nl.hackyourfuture.dojoserver.volunteer.VolunteerRepository;
import nl.hackyourfuture.dojoserver.volunteer.VolunteerStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Locale;

/**
 * Volunteer interactions over MockMvc, signed in with real API tokens because the endpoints read the caller.
 * Transactional like TraineeListTest. Storage is mocked because deleting a volunteer sweeps its picture folder, and
 * Slack so nothing is posted.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class VolunteerInteractionTest {

    private static final String INTERACTIONS = "/api/volunteers/{volunteerId}/interactions";
    private static final String BODY =
            """
                    {"date": "2026-09-01T10:00:00Z", "type": "call", "title": " Intro call ", "details": "Talked about mentoring."}
                    """;

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private VolunteerRepository volunteerRepository;
    @Autowired
    private TraineeRepository traineeRepository;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private InteractionRepository interactionRepository;
    @MockitoBean
    private FileStorageService fileStorageService;
    @MockitoBean
    private SlackClient slackClient;

    private User reporter;
    private String reporterToken;
    private String otherToken;
    private Volunteer jane;

    @BeforeEach
    void givenAVolunteerAndTwoSignedInUsers() {
        reporter = user("Reporter");
        reporterToken = tokenService.issue(reporter, TokenType.API_TOKEN).plaintextToken();
        otherToken = tokenService.issue(user("Someone Else"), TokenType.API_TOKEN).plaintextToken();
        jane = volunteer("Jane", "Roe");
    }

    @Test
    void createRecordsTheInteractionOnTheVolunteer() {
        MvcTestResult result = mvc.post().uri(INTERACTIONS, jane.getId()).header(AUTHORIZATION, bearer(reporterToken))
                .contentType(MediaType.APPLICATION_JSON).content(BODY).exchange();

        assertThat(result).hasStatus(201);
        assertThat(result).bodyJson().extractingPath("$.title").isEqualTo("Intro call");
        assertThat(result).bodyJson().extractingPath("$.reporter.id").isEqualTo(reporter.getId());
        assertThat(interactionRepository.findByVolunteerIdOrderByDateDesc(jane.getId()))
                .singleElement()
                .satisfies(stored -> {
                    assertThat(stored.getTraineeId()).isNull();
                    assertThat(stored.getOrganisationId()).isNull();
                });
        verify(slackClient).sendNotification(contains("Volunteer: [Jane Roe]"));
        verify(slackClient).sendNotification(contains(jane.getProfilePath() + "/interactions)"));
    }

    @Test
    void theListHoldsOnlyTheVolunteersInteractionsMostRecentFirst() {
        Interaction older = interaction(jane, "2026-01-01T10:00:00Z");
        Interaction newer = interaction(jane, "2026-02-01T10:00:00Z");
        interaction(volunteer("John", "Doe"), "2026-03-01T10:00:00Z");

        assertThat(list(jane.getId())).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(newer.getId(), older.getId());
    }

    @Test
    void anUnknownVolunteerIsNotFound() {
        String unknown = RandomUtils.generateRandomId();

        assertThat(list(unknown)).hasStatus(404);
        assertThat(mvc.post().uri(INTERACTIONS, unknown).header(AUTHORIZATION, bearer(reporterToken))
                .contentType(MediaType.APPLICATION_JSON).content(BODY)).hasStatus(404);
    }

    @Test
    void anInteractionIsNotFoundUnderAnotherProfile() {
        Trainee trainee = trainee();
        Organisation acme = organisation("Acme");
        Interaction traineeInteraction = interactionRepository.save(Interaction.builder()
                .id(RandomUtils.generateRandomId())
                .traineeId(trainee.getId())
                .date(Instant.parse("2026-01-01T10:00:00Z"))
                .type(InteractionType.CALL)
                .reporter(reporter)
                .title("Check-in")
                .details("Talked about the assignment.")
                .build());
        Interaction volunteerInteraction = interaction(jane, "2026-01-01T10:00:00Z");

        assertThat(put(itemPath(jane.getId(), traineeInteraction.getId()), reporterToken)).hasStatus(404);
        assertThat(delete(itemPath(jane.getId(), traineeInteraction.getId()), reporterToken)).hasStatus(404);
        String underTheTrainee =
                "/api/trainees/" + trainee.getId() + "/interactions/" + volunteerInteraction.getId();
        assertThat(put(underTheTrainee, reporterToken)).hasStatus(404);
        String underTheOrganisation =
                "/api/organisations/" + acme.getId() + "/interactions/" + volunteerInteraction.getId();
        assertThat(put(underTheOrganisation, reporterToken)).hasStatus(404);
    }

    @Test
    void onlyTheReporterMayEditOrDelete() {
        String path = itemPath(jane.getId(), interaction(jane, "2026-01-01T10:00:00Z").getId());

        assertThat(put(path, otherToken)).hasStatus(403);
        assertThat(delete(path, otherToken)).hasStatus(403);
        assertThat(put(path, reporterToken)).hasStatusOk().bodyJson().extractingPath("$.title").isEqualTo("Intro call");
        assertThat(delete(path, reporterToken)).hasStatus(204);
        assertThat(list(jane.getId())).bodyJson().isEqualTo("[]");
    }

    @Test
    void deletingTheVolunteerDeletesItsInteractions() {
        Interaction interaction = interaction(jane, "2026-01-01T10:00:00Z");

        assertThat(delete("/api/volunteers/" + jane.getId(), reporterToken)).hasStatus(204);

        assertThat(interactionRepository.existsById(interaction.getId())).isFalse();
        verify(fileStorageService).deleteAllWithPrefix("images/volunteers/" + jane.getId() + "/");
    }

    @Test
    void anInteractionCannotBelongToAVolunteerAndATrainee() {
        Interaction both = Interaction.builder()
                .id(RandomUtils.generateRandomId())
                .traineeId(trainee().getId())
                .volunteerId(jane.getId())
                .date(Instant.now())
                .type(InteractionType.CALL)
                .reporter(reporter)
                .title("Both")
                .details("Belongs to a volunteer and a trainee.")
                .build();

        assertThatThrownBy(() -> interactionRepository.saveAndFlush(both))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("interactions_one_profile");
    }

    // ------------------------------------------------------------------ helpers

    private MvcTestResult list(String volunteerId) {
        return mvc.get().uri(INTERACTIONS, volunteerId).header(AUTHORIZATION, bearer(reporterToken)).exchange();
    }

    private MvcTestResult put(String path, String token) {
        return mvc.put().uri(path).header(AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON).content(BODY).exchange();
    }

    private MvcTestResult delete(String path, String token) {
        return mvc.delete().uri(path).header(AUTHORIZATION, bearer(token)).exchange();
    }

    private static String itemPath(String volunteerId, String interactionId) {
        return "/api/volunteers/" + volunteerId + "/interactions/" + interactionId;
    }

    private static String bearer(String token) {
        return "Bearer " + token;
    }

    private User user(String name) {
        return userRepository.save(User.builder()
                .id(RandomUtils.generateRandomId())
                .email(RandomUtils.generateRandomId() + "@example.org")
                .name(name)
                .isActive(true)
                .build());
    }

    // The email is lower case, as the API always stores it.
    private Volunteer volunteer(String firstName, String lastName) {
        return volunteerRepository.save(Volunteer.builder()
                .id(RandomUtils.generateRandomId())
                .firstName(firstName)
                .lastName(lastName)
                .email((RandomUtils.generateRandomId() + "@example.org").toLowerCase(Locale.ROOT))
                .status(VolunteerStatus.ACTIVE)
                .build());
    }

    private Trainee trainee() {
        return traineeRepository.save(Trainee.builder()
                .id(RandomUtils.generateRandomId())
                .firstName("Ann")
                .lastName("Interacted")
                .email(RandomUtils.generateRandomId() + "@example.org")
                .startCohort(9001)
                .track(Track.CORE_PROGRAM)
                .learningStatus(LearningStatus.STUDYING)
                .jobPath(JobPath.NOT_GRADUATED)
                .build());
    }

    private Organisation organisation(String name) {
        return organisationRepository.save(Organisation.builder()
                .id(RandomUtils.generateRandomId())
                .name(name)
                .status(OrganisationStatus.ACTIVE)
                .build());
    }

    private Interaction interaction(Volunteer volunteer, String date) {
        return interactionRepository.save(Interaction.builder()
                .id(RandomUtils.generateRandomId())
                .volunteerId(volunteer.getId())
                .date(Instant.parse(date))
                .type(InteractionType.CALL)
                .reporter(reporter)
                .title("Check-in")
                .details("Talked about mentoring.")
                .build());
    }
}
