package nl.hackyourfuture.dojoserver.volunteer.pairing;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.persistence.EntityManager;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
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
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

/**
 * The mentor pairing endpoints over MockMvc. Transactional, because it runs against the local development database.
 * Every pairing belongs to a volunteer and a trainee seeded here, so local data never shows up.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class MentorPairingTest {

    private static final String PAIRINGS = "/api/volunteers/{volunteerId}/pairings";
    private static final String DATE_ORDER_ERROR = "The end date cannot be before the start date.";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private EntityManager entityManager;
    @Autowired
    private VolunteerRepository volunteerRepository;
    @Autowired
    private TraineeRepository traineeRepository;
    @Autowired
    private MentorPairingRepository pairingRepository;

    private Volunteer jane;
    private Volunteer john;
    private Trainee ann;
    private Trainee ben;

    @BeforeEach
    void givenTwoVolunteersAndTwoTrainees() {
        jane = volunteerRepository.save(volunteer("Jane", "Roe"));
        john = volunteerRepository.save(volunteer("John", "Doe"));
        ann = traineeRepository.save(trainee("Ann", "Paired"));
        ben = traineeRepository.save(trainee("Ben", "Paired"));
    }

    @Test
    void createPairsTheVolunteerWithTheTrainee() {
        LocalDate lastCheckin = LocalDate.now().minusDays(3);
        LocalDate nextCheckin = lastCheckin.plusDays(14);
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("traineeId", " " + ann.getId() + " ");
        body.put("type", "ENGLISH_MENTORSHIP");
        body.put("startDate", "2026-03-01");
        body.put("lastCheckinDate", lastCheckin.toString());
        body.put("nextCheckinDate", nextCheckin.toString());

        MvcTestResult result = post(jane.getId(), objectMapper.writeValueAsString(body));

        assertThat(result).hasStatus(201);
        assertThat(result).bodyJson().extractingPath("$.trainee.id").isEqualTo(ann.getId());
        assertThat(result).bodyJson().extractingPath("$.trainee.name").isEqualTo("Ann Paired");
        assertThat(result).bodyJson().extractingPath("$.trainee.profilePath").isEqualTo(ann.getProfilePath());
        assertThat(result).bodyJson().extractingPath("$.trainee.thumbnailUrl").isNull();
        assertThat(result).bodyJson().extractingPath("$.type").isEqualTo("ENGLISH_MENTORSHIP");
        assertThat(result).bodyJson().extractingPath("$.startDate").isEqualTo("2026-03-01");
        assertThat(result).bodyJson().extractingPath("$.lastCheckinDate").isEqualTo(lastCheckin.toString());
        assertThat(result).bodyJson().extractingPath("$.endDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.nextCheckinDate").isEqualTo(nextCheckin.toString());
        assertThat(result).bodyJson().extractingPath("$.daysSinceLastCheckin").isEqualTo(3);
        assertThat(pairingRepository.findByVolunteerIdOrderByStartDateDescIdAsc(jane.getId())).singleElement()
                .satisfies(stored -> {
                    assertThat(stored.getTrainee()).isEqualTo(ann);
                    assertThat(stored.getType()).isEqualTo(MentorPairingType.ENGLISH_MENTORSHIP);
                });
    }

    @Test
    void createRejectsAnInvalidBody() {
        assertThat(post(jane.getId(), bodyWith("traineeId", null))).hasStatus(400);
        assertThat(post(jane.getId(), bodyWith("traineeId", " "))).hasStatus(400);
        assertThat(post(jane.getId(), bodyWith("type", null))).hasStatus(400);
        // An assignment type that is not a kind of mentorship.
        assertThat(post(jane.getId(), bodyWith("type", "TEACHING"))).hasStatus(400);
        assertThat(post(jane.getId(), bodyWith("startDate", null))).hasStatus(400);
        assertThat(post(jane.getId(), bodyWith("lastCheckinDate", "yesterday"))).hasStatus(400);
        assertThat(list(jane.getId())).bodyJson().isEqualTo("[]");
    }

    @Test
    void anUnknownTraineeIsRejected() {
        String unknown = RandomUtils.generateRandomId();
        String error = "The trainee with id '" + unknown + "' does not exist.";

        MvcTestResult created = post(jane.getId(), bodyWith("traineeId", unknown));
        assertThat(created).hasStatus(400);
        assertThat(created).bodyJson().extractingPath("$.error").isEqualTo(error);

        MentorPairing pairing = pairingRepository.save(pairing(jane, ann, LocalDate.of(2026, 3, 1)));
        MvcTestResult updated = put(jane.getId(), pairing.getId(), bodyWith("traineeId", unknown));
        assertThat(updated).hasStatus(400);
        assertThat(updated).bodyJson().extractingPath("$.error").isEqualTo(error);
    }

    @Test
    void anEndDateBeforeTheStartDateIsRejected() {
        MvcTestResult created = post(jane.getId(), bodyWith("endDate", "2026-02-28"));
        assertThat(created).hasStatus(400);
        assertThat(created).bodyJson().extractingPath("$.error").isEqualTo(DATE_ORDER_ERROR);

        MentorPairing pairing = pairingRepository.save(pairing(jane, ann, LocalDate.of(2026, 3, 1)));
        MvcTestResult updated = put(jane.getId(), pairing.getId(), bodyWith("endDate", "2026-02-28"));
        assertThat(updated).hasStatus(400);
        assertThat(updated).bodyJson().extractingPath("$.error").isEqualTo(DATE_ORDER_ERROR);

        // A one-day pairing ends on the day it starts.
        assertThat(post(jane.getId(), bodyWith("endDate", "2026-03-01"))).hasStatus(201);
    }

    @Test
    void aLastCheckinCannotBeInTheFuture() {
        LocalDate today = LocalDate.now();

        MvcTestResult tomorrow = post(jane.getId(), bodyWith("lastCheckinDate", today.plusDays(1).toString()));
        assertThat(tomorrow).hasStatus(400);
        assertThat(tomorrow).bodyJson().extractingPath("$.error").asString().contains("lastCheckinDate");

        // A check-in today was zero days ago.
        MvcTestResult checkedInToday = post(jane.getId(), bodyWith("lastCheckinDate", today.toString()));
        assertThat(checkedInToday).hasStatus(201);
        assertThat(checkedInToday).bodyJson().extractingPath("$.daysSinceLastCheckin").isEqualTo(0);

        // A next check-in that has passed is kept: it shows the check-in is overdue.
        assertThat(post(jane.getId(), bodyWith("nextCheckinDate", "2026-01-01"))).hasStatus(201);
    }

    @Test
    void theListHoldsOnlyTheVolunteersPairingsLatestStartFirst() {
        MentorPairing older = pairingRepository.save(pairing(jane, ann, LocalDate.of(2025, 1, 1)));
        MentorPairing newer = pairingRepository.save(pairing(jane, ben, LocalDate.of(2026, 1, 1)));
        pairingRepository.save(pairing(john, ann, LocalDate.of(2026, 6, 1)));

        assertThat(list(jane.getId())).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(newer.getId(), older.getId());
    }

    @Test
    void pairingsThatStartOnTheSameDayAreListedById() {
        // Saved in reverse. The prefixes sort the same in any collation, and 11 characters never clash with a real id.
        LocalDate sameDay = LocalDate.of(2026, 1, 1);
        String later =
                pairingRepository.save(pairing("b" + RandomUtils.generateRandomId(), jane, ben, sameDay)).getId();
        String earlier =
                pairingRepository.save(pairing("a" + RandomUtils.generateRandomId(), jane, ann, sameDay)).getId();

        assertThat(list(jane.getId())).bodyJson().extractingPath("$[*].id").asArray().containsExactly(earlier, later);
    }

    @Test
    void updateReplacesEveryField() {
        MentorPairing pairing = pairing(jane, ann, LocalDate.of(2026, 3, 1));
        pairing.setLastCheckinDate(LocalDate.of(2026, 5, 20));
        pairing.setEndDate(LocalDate.of(2026, 6, 30));
        pairing.setNextCheckinDate(LocalDate.of(2026, 6, 17));
        pairingRepository.save(pairing);

        MvcTestResult result = put(jane.getId(), pairing.getId(), """
                {"traineeId": "%s", "type": "HR_MENTORSHIP", "startDate": "2026-02-01"}
                """.formatted(ben.getId()));

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.trainee.id").isEqualTo(ben.getId());
        assertThat(result).bodyJson().extractingPath("$.type").isEqualTo("HR_MENTORSHIP");
        assertThat(result).bodyJson().extractingPath("$.startDate").isEqualTo("2026-02-01");
        assertThat(result).bodyJson().extractingPath("$.lastCheckinDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.endDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.nextCheckinDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.daysSinceLastCheckin").isNull();
    }

    @Test
    void deleteRemovesThePairingAndKeepsTheTrainee() {
        MentorPairing pairing = pairingRepository.save(pairing(jane, ann, LocalDate.of(2026, 3, 1)));

        assertThat(mvc.delete().uri(PAIRINGS + "/{id}", jane.getId(), pairing.getId())).hasStatus(204);

        assertThat(list(jane.getId())).bodyJson().isEqualTo("[]");
        assertThat(traineeRepository.existsById(ann.getId())).isTrue();
    }

    @Test
    void anUnknownVolunteerIsNotFound() {
        String unknown = RandomUtils.generateRandomId();

        assertThat(list(unknown)).hasStatus(404);
        assertThat(post(unknown, """
                {"traineeId": "%s", "type": "TECH_MENTORSHIP", "startDate": "2026-03-01"}
                """.formatted(ann.getId()))).hasStatus(404);
    }

    @Test
    void aPairingIsNotFoundUnderAnotherVolunteer() {
        MentorPairing pairing = pairingRepository.save(pairing(jane, ann, LocalDate.of(2026, 3, 1)));

        assertThat(put(john.getId(), pairing.getId(), bodyWith("type", "HR_MENTORSHIP"))).hasStatus(404);
        assertThat(mvc.delete().uri(PAIRINGS + "/{id}", john.getId(), pairing.getId())).hasStatus(404);
        assertThat(list(jane.getId())).bodyJson().extractingPath("$[0].type").isEqualTo("TECH_MENTORSHIP");
    }

    @Test
    void deletingTheVolunteerDeletesItsPairings() {
        MentorPairing pairing = pairingRepository.save(pairing(jane, ann, LocalDate.of(2026, 3, 1)));

        volunteerRepository.delete(jane);
        volunteerRepository.flush();

        assertThat(pairingRepository.existsById(pairing.getId())).isFalse();
    }

    @Test
    void aPairedTraineeCannotBeDeleted() {
        pairingRepository.save(pairing(jane, ann, LocalDate.of(2026, 3, 1)));
        // Start the request with a clean persistence context, like a real one.
        entityManager.flush();
        entityManager.clear();

        assertThat(mvc.delete().uri("/api/trainees/{id}", ann.getId())).hasStatus(409);
    }

    // ------------------------------------------------------------------ helpers

    private MvcTestResult list(String volunteerId) {
        return mvc.get().uri(PAIRINGS, volunteerId).exchange();
    }

    private MvcTestResult post(String volunteerId, String body) {
        return mvc.post().uri(PAIRINGS, volunteerId).contentType(MediaType.APPLICATION_JSON).content(body)
                .exchange();
    }

    private MvcTestResult put(String volunteerId, String id, String body) {
        return mvc.put().uri(PAIRINGS + "/{id}", volunteerId, id).contentType(MediaType.APPLICATION_JSON)
                .content(body).exchange();
    }

    // A valid body with one member replaced, so a 400 can only come from that member.
    private String bodyWith(String key, Object value) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("traineeId", ann.getId());
        body.put("type", "TECH_MENTORSHIP");
        body.put("startDate", "2026-03-01");
        body.put(key, value);
        return objectMapper.writeValueAsString(body);
    }

    // The email is lower case, as the API always stores it.
    private static Volunteer volunteer(String firstName, String lastName) {
        return Volunteer.builder()
                .id(RandomUtils.generateRandomId())
                .firstName(firstName)
                .lastName(lastName)
                .email((RandomUtils.generateRandomId() + "@example.org").toLowerCase(Locale.ROOT))
                .status(VolunteerStatus.ACTIVE)
                .build();
    }

    // Cohort 9001 keeps the trainees apart from local data.
    private static Trainee trainee(String firstName, String lastName) {
        return Trainee.builder()
                .id(RandomUtils.generateRandomId())
                .firstName(firstName)
                .lastName(lastName)
                .email((RandomUtils.generateRandomId() + "@example.org").toLowerCase(Locale.ROOT))
                .startCohort(9001)
                .track(Track.CORE_PROGRAM)
                .learningStatus(LearningStatus.STUDYING)
                .jobPath(JobPath.NOT_GRADUATED)
                .build();
    }

    private static MentorPairing pairing(Volunteer volunteer, Trainee trainee, LocalDate startDate) {
        return pairing(RandomUtils.generateRandomId(), volunteer, trainee, startDate);
    }

    private static MentorPairing pairing(String id, Volunteer volunteer, Trainee trainee, LocalDate startDate) {
        return MentorPairing.builder()
                .id(id)
                .volunteerId(volunteer.getId())
                .trainee(trainee)
                .type(MentorPairingType.TECH_MENTORSHIP)
                .startDate(startDate)
                .build();
    }
}
