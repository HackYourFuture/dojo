package nl.hackyourfuture.dojoserver.mentorship.checkin;

import static org.assertj.core.api.Assertions.assertThat;

import jakarta.persistence.EntityManager;
import nl.hackyourfuture.dojoserver.mentorship.Mentorship;
import nl.hackyourfuture.dojoserver.mentorship.MentorshipRepository;
import nl.hackyourfuture.dojoserver.mentorship.MentorshipType;
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
 * The check-in endpoints over MockMvc, and the last check-in they give the mentorship. Transactional, because it
 * runs against the local development database; every record belongs to the volunteer and trainee seeded here.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class MentorshipCheckinTest {

    private static final String MENTORSHIP = "/api/mentorships/{mentorshipId}";
    private static final String CHECKINS = MENTORSHIP + "/checkins";

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
    private MentorshipRepository mentorshipRepository;
    @Autowired
    private MentorshipCheckinRepository checkinRepository;

    private Mentorship mentorship;
    private Mentorship other;

    @BeforeEach
    void givenTwoMentorshipsOfAVolunteer() {
        Volunteer jane = volunteerRepository.save(volunteer("Jane", "Roe"));
        Trainee ann = traineeRepository.save(trainee("Ann", "Mentored"));
        Trainee ben = traineeRepository.save(trainee("Ben", "Mentored"));
        mentorship = mentorshipRepository.save(mentorship(jane, ann));
        other = mentorshipRepository.save(mentorship(jane, ben));
    }

    @Test
    void createRecordsACheckin() {
        LocalDate threeDaysAgo = LocalDate.now().minusDays(3);

        MvcTestResult result = post(mentorship, bodyWith("date", threeDaysAgo.toString(), "notes", "  Went well.  "));

        assertThat(result).hasStatus(201);
        assertThat(result).bodyJson().extractingPath("$.id").asString().hasSize(10);
        assertThat(result).bodyJson().extractingPath("$.date").isEqualTo(threeDaysAgo.toString());
        assertThat(result).bodyJson().extractingPath("$.notes").isEqualTo("Went well.");
        assertThat(checkinRepository.findByMentorshipIdOrderByDateDescIdAsc(mentorship.getId())).singleElement()
                .satisfies(stored -> {
                    assertThat(stored.getDate()).isEqualTo(threeDaysAgo);
                    assertThat(stored.getNotes()).isEqualTo("Went well.");
                });
    }

    @Test
    void notesAreRequired() {
        assertThat(post(mentorship, """
                {"date": "2026-03-01"}
                """)).hasStatus(400);
        assertThat(post(mentorship, bodyWith("notes", null))).hasStatus(400);
        MvcTestResult blank = post(mentorship, bodyWith("notes", "   "));
        assertThat(blank).hasStatus(400);
        assertThat(blank).bodyJson().extractingPath("$.error").asString().contains("notes");
        assertThat(list(mentorship)).bodyJson().isEqualTo("[]");
    }

    @Test
    void createRejectsAnInvalidBody() {
        assertThat(post(mentorship, bodyWith("date", null))).hasStatus(400);
        assertThat(post(mentorship, bodyWith("date", "yesterday"))).hasStatus(400);
        assertThat(post(mentorship, bodyWith("notes", "x".repeat(5001)))).hasStatus(400);

        // A check-in is something that happened, so it cannot be dated in the future.
        MvcTestResult tomorrow = post(mentorship, bodyWith("date", LocalDate.now().plusDays(1).toString()));
        assertThat(tomorrow).hasStatus(400);
        assertThat(tomorrow).bodyJson().extractingPath("$.error").asString().contains("date");
        assertThat(post(mentorship, bodyWith("date", LocalDate.now().toString()))).hasStatus(201);

        assertThat(list(mentorship)).bodyJson().extractingPath("$[*].date").asArray().hasSize(1);
    }

    @Test
    void theListHoldsOnlyTheMentorshipsCheckinsNewestFirst() {
        MentorshipCheckin older = checkinRepository.save(checkin(mentorship, LocalDate.of(2025, 1, 1)));
        MentorshipCheckin newer = checkinRepository.save(checkin(mentorship, LocalDate.of(2026, 1, 1)));
        checkinRepository.save(checkin(other, LocalDate.of(2026, 6, 1)));

        assertThat(list(mentorship)).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(newer.getId(), older.getId());
    }

    @Test
    void checkinsOnTheSameDayAreListedById() {
        // Saved in reverse. The prefixes sort the same in any collation, and 11 characters never clash with a real id.
        LocalDate sameDay = LocalDate.of(2026, 1, 1);
        String later =
                checkinRepository.save(checkin("b" + RandomUtils.generateRandomId(), mentorship, sameDay)).getId();
        String earlier =
                checkinRepository.save(checkin("a" + RandomUtils.generateRandomId(), mentorship, sameDay)).getId();

        assertThat(list(mentorship)).bodyJson().extractingPath("$[*].id").asArray().containsExactly(earlier, later);
    }

    @Test
    void updateReplacesDateAndNotes() {
        MentorshipCheckin checkin = checkin(mentorship, LocalDate.of(2026, 3, 1));
        checkin.setNotes("First notes");
        checkinRepository.save(checkin);

        MvcTestResult result =
                put(mentorship, checkin.getId(), bodyWith("date", "2026-02-01", "notes", "Second notes"));

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.id").isEqualTo(checkin.getId());
        assertThat(result).bodyJson().extractingPath("$.date").isEqualTo("2026-02-01");
        assertThat(result).bodyJson().extractingPath("$.notes").isEqualTo("Second notes");
    }

    @Test
    void deleteRemovesTheCheckin() {
        MentorshipCheckin checkin = checkinRepository.save(checkin(mentorship, LocalDate.of(2026, 3, 1)));

        assertThat(mvc.delete().uri(CHECKINS + "/{id}", mentorship.getId(), checkin.getId())).hasStatus(204);

        assertThat(list(mentorship)).bodyJson().isEqualTo("[]");
        assertThat(mentorshipRepository.existsById(mentorship.getId())).isTrue();
        // It was the only check-in, so the mentorship has no last check-in anymore.
        MvcTestResult bare = mvc.get().uri(MENTORSHIP, mentorship.getId()).exchange();
        assertThat(bare).bodyJson().extractingPath("$.lastCheckinDate").isNull();
        assertThat(bare).bodyJson().extractingPath("$.daysSinceLastCheckin").isNull();
    }

    @Test
    void anUnknownMentorshipIsNotFound() {
        String unknown = RandomUtils.generateRandomId();
        MentorshipCheckin checkin = checkinRepository.save(checkin(mentorship, LocalDate.of(2026, 3, 1)));

        assertThat(mvc.get().uri(CHECKINS, unknown)).hasStatus(404);
        assertThat(mvc.post().uri(CHECKINS, unknown).contentType(MediaType.APPLICATION_JSON)
                .content(bodyWith("date", "2026-03-01"))).hasStatus(404);
        assertThat(mvc.put().uri(CHECKINS + "/{id}", unknown, checkin.getId()).contentType(MediaType.APPLICATION_JSON)
                .content(bodyWith("date", "2026-03-01"))).hasStatus(404);
        assertThat(mvc.delete().uri(CHECKINS + "/{id}", unknown, checkin.getId())).hasStatus(404);
    }

    @Test
    void aCheckinIsNotFoundUnderAnotherMentorshipOrByAnUnknownId() {
        MentorshipCheckin checkin = checkinRepository.save(checkin(mentorship, LocalDate.of(2026, 3, 1)));
        String unknown = RandomUtils.generateRandomId();

        assertThat(put(other, checkin.getId(), bodyWith("date", "2026-02-01"))).hasStatus(404);
        assertThat(mvc.delete().uri(CHECKINS + "/{id}", other.getId(), checkin.getId())).hasStatus(404);
        assertThat(put(mentorship, unknown, bodyWith("date", "2026-02-01"))).hasStatus(404);
        assertThat(mvc.delete().uri(CHECKINS + "/{id}", mentorship.getId(), unknown)).hasStatus(404);
        assertThat(list(mentorship)).bodyJson().extractingPath("$[0].date").isEqualTo("2026-03-01");
    }

    @Test
    void deletingTheMentorshipDeletesItsCheckins() {
        MentorshipCheckin checkin = checkinRepository.save(checkin(mentorship, LocalDate.of(2026, 3, 1)));
        // Start the request with a clean persistence context, like a real one: the database cascade does the delete.
        entityManager.flush();
        entityManager.clear();

        assertThat(mvc.delete().uri(MENTORSHIP, mentorship.getId())).hasStatus(204);
        // A real request commits here; in the test transaction the delete has to be flushed by hand.
        entityManager.flush();

        assertThat(checkinRepository.existsById(checkin.getId())).isFalse();
    }

    @Test
    void theMentorshipShowsItsLatestCheckin() {
        LocalDate tenDaysAgo = LocalDate.now().minusDays(10);
        checkinRepository.save(checkin(mentorship, LocalDate.of(2025, 1, 1)));
        MentorshipCheckin latest = checkinRepository.save(checkin(mentorship, tenDaysAgo));
        checkinRepository.save(checkin(other, LocalDate.of(2025, 6, 1)));

        MvcTestResult single = mvc.get().uri(MENTORSHIP, mentorship.getId()).exchange();
        assertThat(single).bodyJson().extractingPath("$.lastCheckinDate").isEqualTo(tenDaysAgo.toString());
        assertThat(single).bodyJson().extractingPath("$.daysSinceLastCheckin").isEqualTo(10);

        // The list looks the check-ins of all its rows up in one go, and each row gets its own.
        MvcTestResult listed = mvc.get().uri("/api/mentorships").param("volunteerId", mentorship.getVolunteer().getId())
                .exchange();
        assertThat(listed).bodyJson()
                .extractingPath("$.content[?(@.id == '" + mentorship.getId() + "')].lastCheckinDate")
                .asArray().containsExactly(tenDaysAgo.toString());
        assertThat(listed).bodyJson()
                .extractingPath("$.content[?(@.id == '" + other.getId() + "')].lastCheckinDate")
                .asArray().containsExactly("2025-06-01");

        // Moving the latest check-in before the other one makes that one the latest.
        assertThat(put(mentorship, latest.getId(), bodyWith("date", "2024-12-01"))).hasStatusOk();
        assertThat(mvc.get().uri(MENTORSHIP, mentorship.getId())).bodyJson().extractingPath("$.lastCheckinDate")
                .isEqualTo("2025-01-01");
    }

    // ------------------------------------------------------------------ helpers

    private MvcTestResult list(Mentorship mentorship) {
        return mvc.get().uri(CHECKINS, mentorship.getId()).exchange();
    }

    private MvcTestResult post(Mentorship mentorship, String body) {
        return mvc.post().uri(CHECKINS, mentorship.getId()).contentType(MediaType.APPLICATION_JSON).content(body)
                .exchange();
    }

    private MvcTestResult put(Mentorship mentorship, String id, String body) {
        return mvc.put().uri(CHECKINS + "/{id}", mentorship.getId(), id).contentType(MediaType.APPLICATION_JSON)
                .content(body).exchange();
    }

    // A valid body with the given members replaced, so a 400 can only come from them.
    private String bodyWith(Object... keysAndValues) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("date", "2026-03-01");
        body.put("notes", "Checked in.");
        for (int i = 0; i < keysAndValues.length; i += 2) {
            body.put((String) keysAndValues[i], keysAndValues[i + 1]);
        }
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

    private static Mentorship mentorship(Volunteer volunteer, Trainee trainee) {
        return Mentorship.builder()
                .id(RandomUtils.generateRandomId())
                .volunteer(volunteer)
                .trainee(trainee)
                .type(MentorshipType.TECH_MENTORSHIP)
                .startDate(LocalDate.of(2024, 9, 1))
                .build();
    }

    private static MentorshipCheckin checkin(Mentorship mentorship, LocalDate date) {
        return checkin(RandomUtils.generateRandomId(), mentorship, date);
    }

    private static MentorshipCheckin checkin(String id, Mentorship mentorship, LocalDate date) {
        return MentorshipCheckin.builder().id(id).mentorshipId(mentorship.getId()).date(date).notes("Checked in.")
                .build();
    }
}
