package nl.hackyourfuture.dojoserver.interaction;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
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
import nl.hackyourfuture.dojoserver.trainee.profile.JobPath;
import nl.hackyourfuture.dojoserver.trainee.profile.LearningStatus;
import nl.hackyourfuture.dojoserver.trainee.profile.Track;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
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

/**
 * Organisation interactions over MockMvc, signed in with real API tokens because the endpoints read the caller.
 * Transactional like TraineeListTest. Storage is mocked because deleting an organisation sweeps its logo folder.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
class OrganisationInteractionTest {

    private static final String INTERACTIONS = "/api/organisations/{organisationId}/interactions";
    private static final String BODY =
            """
                    {"date": "2026-09-01T10:00:00Z", "type": "call", "title": " Intro call ", "details": "Talked about interns."}
                    """;

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private TraineeRepository traineeRepository;
    @Autowired
    private InteractionRepository interactionRepository;
    @MockitoBean
    private FileStorageService fileStorageService;

    private User reporter;
    private String reporterToken;
    private String otherToken;
    private Organisation acme;

    @BeforeEach
    void givenAnOrganisationAndTwoSignedInUsers() {
        reporter = user("Reporter");
        reporterToken = tokenService.issue(reporter, TokenType.API_TOKEN).plaintextToken();
        otherToken = tokenService.issue(user("Someone Else"), TokenType.API_TOKEN).plaintextToken();
        acme = organisation("Acme");
    }

    @Test
    void createRecordsTheInteractionOnTheOrganisation() {
        MvcTestResult result = mvc.post().uri(INTERACTIONS, acme.getId()).header(AUTHORIZATION, bearer(reporterToken))
                .contentType(MediaType.APPLICATION_JSON).content(BODY).exchange();

        assertThat(result).hasStatus(201);
        assertThat(result).bodyJson().extractingPath("$.title").isEqualTo("Intro call");
        assertThat(result).bodyJson().extractingPath("$.reporter.id").isEqualTo(reporter.getId());
        assertThat(interactionRepository.findByOrganisationIdOrderByDateDesc(acme.getId()))
                .singleElement()
                .satisfies(stored -> assertThat(stored.getTraineeId()).isNull());
    }

    @ParameterizedTest
    @ValueSource(strings = {"email", "meeting"})
    void anInteractionCanBeAnEmailOrAMeeting(String type) {
        String body = BODY.replace("\"call\"", "\"" + type + "\"");

        MvcTestResult result = mvc.post().uri(INTERACTIONS, acme.getId()).header(AUTHORIZATION, bearer(reporterToken))
                .contentType(MediaType.APPLICATION_JSON).content(body).exchange();

        assertThat(result).hasStatus(201);
        assertThat(result).bodyJson().extractingPath("$.type").isEqualTo(type);
    }

    @Test
    void aTraineeInteractionStaysOnTheTrainee() {
        Trainee trainee = trainee();

        assertThat(mvc.post().uri("/api/trainees/{traineeId}/interactions", trainee.getId())
                .header(AUTHORIZATION, bearer(reporterToken))
                .contentType(MediaType.APPLICATION_JSON).content(BODY)).hasStatus(201);

        assertThat(interactionRepository.findByTraineeIdOrderByDateDesc(trainee.getId()))
                .singleElement()
                .satisfies(stored -> assertThat(stored.getOrganisationId()).isNull());
    }

    @Test
    void theListHoldsOnlyTheOrganisationsInteractionsMostRecentFirst() {
        Interaction older = interaction(acme, "2026-01-01T10:00:00Z");
        Interaction newer = interaction(acme, "2026-02-01T10:00:00Z");
        interaction(organisation("Globex"), "2026-03-01T10:00:00Z");

        assertThat(list(acme.getId())).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(newer.getId(), older.getId());
    }

    @Test
    void anUnknownOrganisationIsNotFound() {
        String unknown = RandomUtils.generateRandomId();

        assertThat(list(unknown)).hasStatus(404);
        assertThat(mvc.post().uri(INTERACTIONS, unknown).header(AUTHORIZATION, bearer(reporterToken))
                .contentType(MediaType.APPLICATION_JSON).content(BODY)).hasStatus(404);
    }

    @Test
    void anInteractionIsNotFoundUnderAnotherProfile() {
        Trainee trainee = trainee();
        Interaction traineeInteraction = interactionRepository.save(Interaction.builder()
                .id(RandomUtils.generateRandomId())
                .traineeId(trainee.getId())
                .date(Instant.parse("2026-01-01T10:00:00Z"))
                .type(InteractionType.CALL)
                .reporter(reporter)
                .title("Check-in")
                .details("Talked about the assignment.")
                .build());
        Interaction organisationInteraction = interaction(acme, "2026-01-01T10:00:00Z");

        assertThat(put(itemPath(acme.getId(), traineeInteraction.getId()), reporterToken)).hasStatus(404);
        assertThat(delete(itemPath(acme.getId(), traineeInteraction.getId()), reporterToken)).hasStatus(404);
        String underTheTrainee =
                "/api/trainees/" + trainee.getId() + "/interactions/" + organisationInteraction.getId();
        assertThat(put(underTheTrainee, reporterToken)).hasStatus(404);
    }

    @Test
    void onlyTheReporterMayEditOrDelete() {
        String path = itemPath(acme.getId(), interaction(acme, "2026-01-01T10:00:00Z").getId());

        assertThat(put(path, otherToken)).hasStatus(403);
        assertThat(delete(path, otherToken)).hasStatus(403);
        assertThat(put(path, reporterToken)).hasStatusOk().bodyJson().extractingPath("$.title").isEqualTo("Intro call");
        assertThat(delete(path, reporterToken)).hasStatus(204);
        assertThat(list(acme.getId())).bodyJson().isEqualTo("[]");
    }

    @Test
    void deletingTheOrganisationDeletesItsInteractions() {
        Interaction interaction = interaction(acme, "2026-01-01T10:00:00Z");

        assertThat(delete("/api/organisations/" + acme.getId(), reporterToken)).hasStatus(204);

        assertThat(interactionRepository.existsById(interaction.getId())).isFalse();
    }

    @Test
    void anInteractionCannotBelongToTwoProfiles() {
        Interaction both = Interaction.builder()
                .id(RandomUtils.generateRandomId())
                .traineeId(trainee().getId())
                .organisationId(acme.getId())
                .date(Instant.now())
                .type(InteractionType.CALL)
                .reporter(reporter)
                .title("Both")
                .details("Belongs to a trainee and an organisation.")
                .build();

        assertThatThrownBy(() -> interactionRepository.saveAndFlush(both))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("interactions_one_profile");
    }

    @Test
    void anInteractionMustBelongToAProfile() {
        Interaction neither = Interaction.builder()
                .id(RandomUtils.generateRandomId())
                .date(Instant.now())
                .type(InteractionType.CALL)
                .reporter(reporter)
                .title("Neither")
                .details("Belongs to no one.")
                .build();

        assertThatThrownBy(() -> interactionRepository.saveAndFlush(neither))
                .isInstanceOf(DataIntegrityViolationException.class)
                .hasMessageContaining("interactions_one_profile");
    }

    // ------------------------------------------------------------------ helpers

    private MvcTestResult list(String organisationId) {
        return mvc.get().uri(INTERACTIONS, organisationId).header(AUTHORIZATION, bearer(reporterToken)).exchange();
    }

    private MvcTestResult put(String path, String token) {
        return mvc.put().uri(path).header(AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON).content(BODY).exchange();
    }

    private MvcTestResult delete(String path, String token) {
        return mvc.delete().uri(path).header(AUTHORIZATION, bearer(token)).exchange();
    }

    private static String itemPath(String organisationId, String interactionId) {
        return "/api/organisations/" + organisationId + "/interactions/" + interactionId;
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

    private Organisation organisation(String name) {
        return organisationRepository.save(Organisation.builder()
                .id(RandomUtils.generateRandomId())
                .name(name)
                .status(OrganisationStatus.ACTIVE)
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

    private Interaction interaction(Organisation organisation, String date) {
        return interactionRepository.save(Interaction.builder()
                .id(RandomUtils.generateRandomId())
                .organisationId(organisation.getId())
                .date(Instant.parse(date))
                .type(InteractionType.CALL)
                .reporter(reporter)
                .title("Check-in")
                .details("Talked about the next cohort.")
                .build());
    }
}
