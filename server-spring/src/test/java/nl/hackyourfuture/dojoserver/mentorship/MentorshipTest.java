package nl.hackyourfuture.dojoserver.mentorship;

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
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * The mentorship endpoints over MockMvc. Transactional, because it runs against the local development database.
 * Every mentorship belongs to a volunteer and a trainee seeded here, so local data never shows up in a filtered list.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class MentorshipTest {

    private static final String MENTORSHIPS = "/api/mentorships";
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
    private MentorshipRepository mentorshipRepository;

    private Volunteer jane;
    private Volunteer john;
    private Trainee ann;
    private Trainee ben;

    @BeforeEach
    void givenTwoVolunteersAndTwoTrainees() {
        jane = volunteerRepository.save(volunteer("Jane", "Roe"));
        john = volunteerRepository.save(volunteer("John", "Doe"));
        ann = traineeRepository.save(trainee("Ann", "Mentored"));
        ben = traineeRepository.save(trainee("Ben", "Mentored"));
    }

    @Test
    void createPairsTheVolunteerWithTheTrainee() {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("volunteerId", " " + jane.getId() + " ");
        body.put("traineeId", " " + ann.getId() + " ");
        body.put("type", "ENGLISH_MENTORSHIP");
        body.put("startDate", "2026-03-01");
        body.put("nextCheckinDate", "2026-03-15");

        MvcTestResult result = post(objectMapper.writeValueAsString(body));

        assertThat(result).hasStatus(201);
        assertThat(result).bodyJson().extractingPath("$.volunteer.id").isEqualTo(jane.getId());
        assertThat(result).bodyJson().extractingPath("$.volunteer.name").isEqualTo("Jane Roe");
        assertThat(result).bodyJson().extractingPath("$.volunteer.profilePath").isEqualTo(jane.getProfilePath());
        assertThat(result).bodyJson().extractingPath("$.volunteer.thumbnailUrl").isNull();
        assertThat(result).bodyJson().extractingPath("$.trainee.id").isEqualTo(ann.getId());
        assertThat(result).bodyJson().extractingPath("$.trainee.name").isEqualTo("Ann Mentored");
        assertThat(result).bodyJson().extractingPath("$.trainee.profilePath").isEqualTo(ann.getProfilePath());
        assertThat(result).bodyJson().extractingPath("$.trainee.thumbnailUrl").isNull();
        assertThat(result).bodyJson().extractingPath("$.type").isEqualTo("ENGLISH_MENTORSHIP");
        assertThat(result).bodyJson().extractingPath("$.startDate").isEqualTo("2026-03-01");
        assertThat(result).bodyJson().extractingPath("$.endDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.nextCheckinDate").isEqualTo("2026-03-15");
        // No check-in has been recorded yet. MentorshipCheckinTest covers the mentorship with check-ins.
        assertThat(result).bodyJson().extractingPath("$.lastCheckinDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.daysSinceLastCheckin").isNull();
        assertThat(storedFor(jane)).singleElement().satisfies(stored -> {
            assertThat(stored.getVolunteer()).isEqualTo(jane);
            assertThat(stored.getTrainee()).isEqualTo(ann);
            assertThat(stored.getType()).isEqualTo(MentorshipType.ENGLISH_MENTORSHIP);
        });
    }

    @Test
    void createRejectsAnInvalidBody() {
        assertThat(post(bodyWith("volunteerId", null))).hasStatus(400);
        assertThat(post(bodyWith("volunteerId", " "))).hasStatus(400);
        assertThat(post(bodyWith("traineeId", null))).hasStatus(400);
        assertThat(post(bodyWith("traineeId", " "))).hasStatus(400);
        assertThat(post(bodyWith("type", null))).hasStatus(400);
        // An assignment type that is not a kind of mentorship.
        assertThat(post(bodyWith("type", "TEACHING"))).hasStatus(400);
        assertThat(post(bodyWith("startDate", null))).hasStatus(400);
        assertThat(post(bodyWith("nextCheckinDate", "soon"))).hasStatus(400);
        assertThat(listOf(jane)).bodyJson().isEqualTo("[]");
    }

    @Test
    void anUnknownVolunteerIsRejected() {
        String unknown = RandomUtils.generateRandomId();
        String error = "The volunteer with id '" + unknown + "' does not exist.";

        MvcTestResult created = post(bodyWith("volunteerId", unknown));
        assertThat(created).hasStatus(400);
        assertThat(created).bodyJson().extractingPath("$.error").isEqualTo(error);

        Mentorship mentorship = mentorshipRepository.save(mentorship(jane, ann, LocalDate.of(2026, 3, 1)));
        MvcTestResult updated = put(mentorship.getId(), bodyWith("volunteerId", unknown));
        assertThat(updated).hasStatus(400);
        assertThat(updated).bodyJson().extractingPath("$.error").isEqualTo(error);
    }

    @Test
    void anUnknownTraineeIsRejected() {
        String unknown = RandomUtils.generateRandomId();
        String error = "The trainee with id '" + unknown + "' does not exist.";

        MvcTestResult created = post(bodyWith("traineeId", unknown));
        assertThat(created).hasStatus(400);
        assertThat(created).bodyJson().extractingPath("$.error").isEqualTo(error);

        Mentorship mentorship = mentorshipRepository.save(mentorship(jane, ann, LocalDate.of(2026, 3, 1)));
        MvcTestResult updated = put(mentorship.getId(), bodyWith("traineeId", unknown));
        assertThat(updated).hasStatus(400);
        assertThat(updated).bodyJson().extractingPath("$.error").isEqualTo(error);
    }

    @Test
    void anEndDateBeforeTheStartDateIsRejected() {
        MvcTestResult created = post(bodyWith("endDate", "2026-02-28"));
        assertThat(created).hasStatus(400);
        assertThat(created).bodyJson().extractingPath("$.error").isEqualTo(DATE_ORDER_ERROR);

        Mentorship mentorship = mentorshipRepository.save(mentorship(jane, ann, LocalDate.of(2026, 3, 1)));
        MvcTestResult updated = put(mentorship.getId(), bodyWith("endDate", "2026-02-28"));
        assertThat(updated).hasStatus(400);
        assertThat(updated).bodyJson().extractingPath("$.error").isEqualTo(DATE_ORDER_ERROR);

        // A one-day mentorship ends on the day it starts.
        assertThat(post(bodyWith("endDate", "2026-03-01"))).hasStatus(201);
    }

    @Test
    void aNextCheckinThatHasPassedIsKept() {
        // It shows the check-in is overdue.
        assertThat(post(bodyWith("nextCheckinDate", "2026-01-01"))).hasStatus(201);
    }

    @Test
    void theListOfAVolunteerHoldsOnlyTheirMentorshipsLatestStartFirst() {
        Mentorship older = mentorshipRepository.save(mentorship(jane, ann, LocalDate.of(2025, 1, 1)));
        Mentorship newer = mentorshipRepository.save(mentorship(jane, ben, LocalDate.of(2026, 1, 1)));
        mentorshipRepository.save(mentorship(john, ann, LocalDate.of(2026, 6, 1)));

        assertThat(listOf(jane)).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(newer.getId(), older.getId());
    }

    @Test
    void theListCanBeFilteredByTraineeAndByBothSides() {
        Mentorship janeAnn = mentorshipRepository.save(mentorship(jane, ann, LocalDate.of(2025, 1, 1)));
        Mentorship johnAnn = mentorshipRepository.save(mentorship(john, ann, LocalDate.of(2026, 6, 1)));
        mentorshipRepository.save(mentorship(jane, ben, LocalDate.of(2026, 1, 1)));

        assertThat(list(null, ann.getId())).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(johnAnn.getId(), janeAnn.getId());
        assertThat(list(jane.getId(), ann.getId())).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(janeAnn.getId());
        assertThat(list(john.getId(), ben.getId())).bodyJson().isEqualTo("[]");
        // An unknown id is not an error: it matches nothing.
        assertThat(list(RandomUtils.generateRandomId(), null)).bodyJson().isEqualTo("[]");
    }

    @Test
    void theUnfilteredListHoldsEveryMentorship() {
        Mentorship janeAnn = mentorshipRepository.save(mentorship(jane, ann, LocalDate.of(2026, 1, 1)));
        Mentorship johnBen = mentorshipRepository.save(mentorship(john, ben, LocalDate.of(2026, 6, 1)));

        // Local data may be listed too, so only the seeded mentorships are checked.
        assertThat(list(null, null)).bodyJson().extractingPath("$[*].id").asArray()
                .contains(janeAnn.getId(), johnBen.getId());
        // A blank filter is no filter.
        assertThat(list("", "")).bodyJson().extractingPath("$[*].id").asArray()
                .contains(janeAnn.getId(), johnBen.getId());
    }

    @Test
    void mentorshipsThatStartOnTheSameDayAreListedById() {
        // Saved in reverse. The prefixes sort the same in any collation, and 11 characters never clash with a real id.
        LocalDate sameDay = LocalDate.of(2026, 1, 1);
        String later = mentorshipRepository
                .save(mentorship("b" + RandomUtils.generateRandomId(), jane, ben, sameDay)).getId();
        String earlier = mentorshipRepository
                .save(mentorship("a" + RandomUtils.generateRandomId(), jane, ann, sameDay)).getId();

        assertThat(listOf(jane)).bodyJson().extractingPath("$[*].id").asArray().containsExactly(earlier, later);
    }

    @Test
    void getReturnsTheMentorshipWithBothSides() {
        Mentorship mentorship = mentorshipRepository.save(mentorship(jane, ann, LocalDate.of(2026, 3, 1)));

        MvcTestResult result = mvc.get().uri(MENTORSHIPS + "/{id}", mentorship.getId()).exchange();

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.id").isEqualTo(mentorship.getId());
        assertThat(result).bodyJson().extractingPath("$.volunteer.id").isEqualTo(jane.getId());
        assertThat(result).bodyJson().extractingPath("$.volunteer.name").isEqualTo("Jane Roe");
        assertThat(result).bodyJson().extractingPath("$.trainee.id").isEqualTo(ann.getId());
        assertThat(result).bodyJson().extractingPath("$.trainee.name").isEqualTo("Ann Mentored");
        assertThat(result).bodyJson().extractingPath("$.type").isEqualTo("TECH_MENTORSHIP");
        assertThat(result).bodyJson().extractingPath("$.startDate").isEqualTo("2026-03-01");
        assertThat(result).bodyJson().extractingPath("$.daysSinceLastCheckin").isNull();
    }

    @Test
    void updateReplacesEveryField() {
        Mentorship mentorship = mentorship(jane, ann, LocalDate.of(2026, 3, 1));
        mentorship.setEndDate(LocalDate.of(2026, 6, 30));
        mentorship.setNextCheckinDate(LocalDate.of(2026, 6, 17));
        mentorshipRepository.save(mentorship);

        MvcTestResult result = put(mentorship.getId(), """
                {"volunteerId": "%s", "traineeId": "%s", "type": "HR_MENTORSHIP", "startDate": "2026-02-01"}
                """.formatted(john.getId(), ben.getId()));

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.volunteer.id").isEqualTo(john.getId());
        assertThat(result).bodyJson().extractingPath("$.trainee.id").isEqualTo(ben.getId());
        assertThat(result).bodyJson().extractingPath("$.type").isEqualTo("HR_MENTORSHIP");
        assertThat(result).bodyJson().extractingPath("$.startDate").isEqualTo("2026-02-01");
        assertThat(result).bodyJson().extractingPath("$.lastCheckinDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.endDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.nextCheckinDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.daysSinceLastCheckin").isNull();
        // Moved to John in place, not copied.
        assertThat(listOf(jane)).bodyJson().isEqualTo("[]");
        assertThat(listOf(john)).bodyJson().extractingPath("$[*].id").asArray().containsExactly(mentorship.getId());
    }

    @Test
    void deleteRemovesTheMentorshipAndKeepsBothSides() {
        Mentorship mentorship = mentorshipRepository.save(mentorship(jane, ann, LocalDate.of(2026, 3, 1)));

        assertThat(mvc.delete().uri(MENTORSHIPS + "/{id}", mentorship.getId())).hasStatus(204);

        assertThat(listOf(jane)).bodyJson().isEqualTo("[]");
        assertThat(volunteerRepository.existsById(jane.getId())).isTrue();
        assertThat(traineeRepository.existsById(ann.getId())).isTrue();
    }

    @Test
    void anUnknownMentorshipIsNotFound() {
        String unknown = RandomUtils.generateRandomId();

        assertThat(mvc.get().uri(MENTORSHIPS + "/{id}", unknown)).hasStatus(404);
        assertThat(put(unknown, bodyWith("type", "HR_MENTORSHIP"))).hasStatus(404);
        assertThat(mvc.delete().uri(MENTORSHIPS + "/{id}", unknown)).hasStatus(404);
    }

    @Test
    void deletingTheVolunteerDeletesItsMentorships() {
        Mentorship mentorship = mentorshipRepository.save(mentorship(jane, ann, LocalDate.of(2026, 3, 1)));
        // Start with a clean persistence context, like a real request: the database cascade does the delete.
        entityManager.flush();
        entityManager.clear();

        volunteerRepository.delete(jane);
        volunteerRepository.flush();

        assertThat(mentorshipRepository.existsById(mentorship.getId())).isFalse();
    }

    @Test
    void aMentoredTraineeCannotBeDeleted() {
        mentorshipRepository.save(mentorship(jane, ann, LocalDate.of(2026, 3, 1)));
        // Start the request with a clean persistence context, like a real one.
        entityManager.flush();
        entityManager.clear();

        assertThat(mvc.delete().uri("/api/trainees/{id}", ann.getId())).hasStatus(409);
    }

    // ------------------------------------------------------------------ helpers

    // Either filter is left out when null, and sent as is otherwise.
    private MvcTestResult list(String volunteerId, String traineeId) {
        var request = mvc.get().uri(MENTORSHIPS);
        if (volunteerId != null) {
            request.param("volunteerId", volunteerId);
        }
        if (traineeId != null) {
            request.param("traineeId", traineeId);
        }
        return request.exchange();
    }

    private MvcTestResult listOf(Volunteer volunteer) {
        return list(volunteer.getId(), null);
    }

    private MvcTestResult post(String body) {
        return mvc.post().uri(MENTORSHIPS).contentType(MediaType.APPLICATION_JSON).content(body).exchange();
    }

    private MvcTestResult put(String id, String body) {
        return mvc.put().uri(MENTORSHIPS + "/{id}", id).contentType(MediaType.APPLICATION_JSON).content(body)
                .exchange();
    }

    private List<Mentorship> storedFor(Volunteer volunteer) {
        return mentorshipRepository.findAll(
                Specification.where(MentorshipSpecifications.volunteerIs(volunteer.getId())), Sort.by("id"));
    }

    // A valid body with one member replaced, so a 400 can only come from that member.
    private String bodyWith(String key, Object value) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("volunteerId", jane.getId());
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

    private static Mentorship mentorship(Volunteer volunteer, Trainee trainee, LocalDate startDate) {
        return mentorship(RandomUtils.generateRandomId(), volunteer, trainee, startDate);
    }

    private static Mentorship mentorship(String id, Volunteer volunteer, Trainee trainee, LocalDate startDate) {
        return Mentorship.builder()
                .id(id)
                .volunteer(volunteer)
                .trainee(trainee)
                .type(MentorshipType.TECH_MENTORSHIP)
                .startDate(startDate)
                .build();
    }
}
