package nl.hackyourfuture.dojoserver.volunteer.assignment;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.volunteer.Volunteer;
import nl.hackyourfuture.dojoserver.volunteer.VolunteerAssignmentType;
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
 * The volunteer assignment endpoints over MockMvc. Transactional, because it runs against the local development
 * database. Every assignment belongs to a volunteer seeded here, so local data never shows up.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class VolunteerAssignmentTest {

    private static final String ASSIGNMENTS = "/api/volunteers/{volunteerId}/assignments";
    private static final String DATE_ORDER_ERROR = "The end date cannot be before the start date.";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private VolunteerRepository volunteerRepository;
    @Autowired
    private VolunteerAssignmentRepository assignmentRepository;

    private Volunteer jane;
    private Volunteer john;

    @BeforeEach
    void givenTwoVolunteers() {
        jane = volunteerRepository.save(volunteer("Jane", "Roe"));
        john = volunteerRepository.save(volunteer("John", "Doe"));
    }

    @Test
    void createAddsTheAssignmentToTheVolunteer() {
        MvcTestResult result = post(jane.getId(), """
                {"type": "tech-mentorship", "estimatedHours": 40, "startDate": "2026-03-01", "notes": " Final project "}
                """);

        assertThat(result).hasStatus(201);
        assertThat(result).bodyJson().extractingPath("$.type").isEqualTo("tech-mentorship");
        assertThat(result).bodyJson().extractingPath("$.estimatedHours").isEqualTo(40);
        assertThat(result).bodyJson().extractingPath("$.startDate").isEqualTo("2026-03-01");
        assertThat(result).bodyJson().extractingPath("$.endDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.notes").isEqualTo("Final project");
        assertThat(assignmentRepository.findByVolunteerIdOrderByStartDateDesc(jane.getId())).singleElement()
                .satisfies(stored -> {
                    assertThat(stored.getType()).isEqualTo(VolunteerAssignmentType.TECH_MENTORSHIP);
                    assertThat(stored.getEstimatedHours()).isEqualTo(40);
                });
    }

    @Test
    void createRejectsAnInvalidBody() {
        assertThat(post(jane.getId(), bodyWith("type", null))).hasStatus(400);
        assertThat(post(jane.getId(), bodyWith("type", "cooking"))).hasStatus(400);
        assertThat(post(jane.getId(), bodyWith("startDate", null))).hasStatus(400);
        assertThat(post(jane.getId(), bodyWith("estimatedHours", 0))).hasStatus(400);
        assertThat(post(jane.getId(), bodyWith("estimatedHours", 1001))).hasStatus(400);
        assertThat(post(jane.getId(), bodyWith("notes", "x".repeat(5001)))).hasStatus(400);
        assertThat(list(jane.getId())).bodyJson().isEqualTo("[]");
    }

    @Test
    void anEndDateBeforeTheStartDateIsRejected() {
        MvcTestResult created = post(jane.getId(), bodyWith("endDate", "2026-02-28"));
        assertThat(created).hasStatus(400);
        assertThat(created).bodyJson().extractingPath("$.error").isEqualTo(DATE_ORDER_ERROR);

        VolunteerAssignment assignment = assignmentRepository.save(assignment(jane, LocalDate.of(2026, 3, 1)));
        MvcTestResult updated = put(jane.getId(), assignment.getId(), bodyWith("endDate", "2026-02-28"));
        assertThat(updated).hasStatus(400);
        assertThat(updated).bodyJson().extractingPath("$.error").isEqualTo(DATE_ORDER_ERROR);

        // A one-day assignment ends on the day it starts.
        assertThat(post(jane.getId(), bodyWith("endDate", "2026-03-01"))).hasStatus(201);
    }

    @Test
    void theListHoldsOnlyTheVolunteersAssignmentsLatestStartFirst() {
        VolunteerAssignment older = assignmentRepository.save(assignment(jane, LocalDate.of(2025, 1, 1)));
        VolunteerAssignment newer = assignmentRepository.save(assignment(jane, LocalDate.of(2026, 1, 1)));
        assignmentRepository.save(assignment(john, LocalDate.of(2026, 6, 1)));

        assertThat(list(jane.getId())).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(newer.getId(), older.getId());
    }

    @Test
    void updateReplacesEveryField() {
        VolunteerAssignment assignment = assignment(jane, LocalDate.of(2026, 3, 1));
        assignment.setEstimatedHours(40);
        assignment.setEndDate(LocalDate.of(2026, 6, 30));
        assignment.setNotes("Final project");
        assignmentRepository.save(assignment);

        MvcTestResult result = put(jane.getId(), assignment.getId(), """
                {"type": "workshop-host", "startDate": "2026-02-01"}
                """);

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.type").isEqualTo("workshop-host");
        assertThat(result).bodyJson().extractingPath("$.startDate").isEqualTo("2026-02-01");
        assertThat(result).bodyJson().extractingPath("$.estimatedHours").isNull();
        assertThat(result).bodyJson().extractingPath("$.endDate").isNull();
        assertThat(result).bodyJson().extractingPath("$.notes").isNull();
    }

    @Test
    void deleteRemovesTheAssignment() {
        VolunteerAssignment assignment = assignmentRepository.save(assignment(jane, LocalDate.of(2026, 3, 1)));

        assertThat(mvc.delete().uri(ASSIGNMENTS + "/{id}", jane.getId(), assignment.getId())).hasStatus(204);

        assertThat(list(jane.getId())).bodyJson().isEqualTo("[]");
    }

    @Test
    void anUnknownVolunteerIsNotFound() {
        String unknown = RandomUtils.generateRandomId();

        assertThat(list(unknown)).hasStatus(404);
        assertThat(post(unknown, bodyWith("notes", null))).hasStatus(404);
    }

    @Test
    void anAssignmentIsNotFoundUnderAnotherVolunteer() {
        VolunteerAssignment assignment = assignmentRepository.save(assignment(jane, LocalDate.of(2026, 3, 1)));

        assertThat(put(john.getId(), assignment.getId(), bodyWith("type", "workshop-host"))).hasStatus(404);
        assertThat(mvc.delete().uri(ASSIGNMENTS + "/{id}", john.getId(), assignment.getId())).hasStatus(404);
        assertThat(list(jane.getId())).bodyJson().extractingPath("$[0].type").isEqualTo("teaching");
    }

    @Test
    void deletingTheVolunteerDeletesItsAssignments() {
        VolunteerAssignment assignment = assignmentRepository.save(assignment(jane, LocalDate.of(2026, 3, 1)));

        volunteerRepository.delete(jane);
        volunteerRepository.flush();

        assertThat(assignmentRepository.existsById(assignment.getId())).isFalse();
    }

    // ------------------------------------------------------------------ helpers

    private MvcTestResult list(String volunteerId) {
        return mvc.get().uri(ASSIGNMENTS, volunteerId).exchange();
    }

    private MvcTestResult post(String volunteerId, String body) {
        return mvc.post().uri(ASSIGNMENTS, volunteerId).contentType(MediaType.APPLICATION_JSON).content(body)
                .exchange();
    }

    private MvcTestResult put(String volunteerId, String id, String body) {
        return mvc.put().uri(ASSIGNMENTS + "/{id}", volunteerId, id).contentType(MediaType.APPLICATION_JSON)
                .content(body).exchange();
    }

    // A valid body with one member replaced, so a 400 can only come from that member.
    private String bodyWith(String key, Object value) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("type", "teaching");
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

    private static VolunteerAssignment assignment(Volunteer volunteer, LocalDate startDate) {
        return VolunteerAssignment.builder()
                .id(RandomUtils.generateRandomId())
                .volunteerId(volunteer.getId())
                .type(VolunteerAssignmentType.TEACHING)
                .startDate(startDate)
                .build();
    }
}
