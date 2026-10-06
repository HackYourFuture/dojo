package nl.hackyourfuture.dojoserver.volunteer;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import com.jayway.jsonpath.JsonPath;
import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.authentication.token.TokenService;
import nl.hackyourfuture.dojoserver.authentication.token.TokenType;
import nl.hackyourfuture.dojoserver.filestorage.FileStorageService;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.model.Gender;
import nl.hackyourfuture.dojoserver.slack.SlackClient;
import nl.hackyourfuture.dojoserver.volunteer.dto.VolunteerResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.ObjectMapper;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * The volunteer endpoints over MockMvc. Transactional, because it runs against the local development database, whose
 * own volunteers share the list with the seeded ones. Storage is mocked because CI has no S3, and Slack so nothing is
 * posted. Create, update and delete read the caller, so all three sign in with a real token.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class VolunteerEndpointTest {

    private static final String VOLUNTEERS = "/api/volunteers";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private VolunteerRepository volunteerRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;
    @Autowired
    private ObjectMapper objectMapper;
    @MockitoBean
    private FileStorageService fileStorageService;
    @MockitoBean
    private SlackClient slackClient;

    private String token;

    @BeforeEach
    void givenASignedInUser() {
        User user = userRepository.save(User.builder()
                .id(RandomUtils.generateRandomId())
                .email(RandomUtils.generateRandomId() + "@example.org")
                .name("Reporter")
                .isActive(true)
                .build());
        token = tokenService.issue(user, TokenType.API_TOKEN).plaintextToken();
    }

    // ------------------------------------------------------------------ create

    @Test
    void createReturnsTheVolunteerWithItsIdAndPath() {
        String email = RandomUtils.generateRandomId() + "@Example.ORG";

        MvcTestResult result = post("""
                {"firstName": "  Jane ", "lastName": "Roe", "email": " %s ", "status": "active",
                 "companyName": "Acme B.V."}
                """.formatted(email));

        assertThat(result).hasStatus(201);
        assertThat(result).bodyJson().convertTo(VolunteerResponse.class).satisfies(created -> {
            assertThat(created.firstName()).isEqualTo("Jane");
            assertThat(created.email()).isEqualTo(email.toLowerCase(Locale.ROOT));
            assertThat(created.displayName()).isEqualTo("Jane Roe");
            assertThat(created.status()).isEqualTo(VolunteerStatus.ACTIVE);
            assertThat(created.pictureUrl()).isNull();
            assertThat(created.thumbnailUrl()).isNull();
            assertThat(created.profilePath()).isEqualTo("/volunteer/jane-roe_" + created.id());
            assertThat(volunteerRepository.findById(created.id())).isPresent();
            verify(slackClient).sendNotification(contains(created.profilePath()));
        });
    }

    @Test
    void createRejectsAMissingNameEmailOrStatus() {
        assertThat(post(valid("firstName", null))).hasStatus(400);
        assertThat(post(valid("firstName", "  "))).hasStatus(400);
        assertThat(post(valid("lastName", "  "))).hasStatus(400);
        assertThat(post(valid("email", null))).hasStatus(400);
        assertThat(post(valid("status", null))).hasStatus(400);
        // The keys may also be left out altogether.
        assertThat(post("""
                {"firstName": "Jane", "lastName": "Roe", "status": "active"}
                """)).hasStatus(400);
        assertThat(post("""
                {"firstName": "Jane", "lastName": "Roe", "email": "%s@example.org"}
                """.formatted(RandomUtils.generateRandomId()))).hasStatus(400);
    }

    @Test
    void createRejectsAnUnknownStatusOrGender() {
        assertThat(post(valid("status", "retired"))).hasStatus(400);
        assertThat(post(valid("gender", "unknown"))).hasStatus(400);
    }

    @Test
    void createRejectsAnInvalidEmailOrLinkedinUrl() {
        assertThat(post(valid("email", "not-an-email"))).hasStatus(400);
        assertThat(post(valid("linkedinUrl", "linkedin.com/in/jane"))).hasStatus(400);
        assertThat(post(valid("linkedinUrl", "javascript:alert(1)"))).hasStatus(400);
        // An empty string passes @URL, so it is the size limit that turns it away.
        assertThat(post(valid("linkedinUrl", ""))).hasStatus(400);
    }

    @Test
    void createRejectsAnEmailAnotherVolunteerUsesIgnoringCase() {
        Volunteer existing = volunteerRepository.save(volunteer("Jane", "Roe"));

        MvcTestResult result = post(valid("email", existing.getEmail().toUpperCase(Locale.ROOT)));

        assertThat(result).hasStatus(409);
        assertThat(result).bodyJson().extractingPath("$.error")
                .isEqualTo("Email is already in use by another volunteer.");
    }

    // ------------------------------------------------------------------ read

    @Test
    void getReturnsTheVolunteer() {
        Volunteer volunteer = volunteerRepository.save(volunteer("Jane", "Roe"));

        MvcTestResult result = mvc.get().uri(VOLUNTEERS + "/{id}", volunteer.getId()).exchange();

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.displayName").isEqualTo("Jane Roe");
        assertThat(result).bodyJson().extractingPath("$.status").isEqualTo("active");
        assertThat(result).bodyJson().extractingPath("$.profilePath").isEqualTo(volunteer.getProfilePath());
    }

    @Test
    void anUnknownIdIsNotFound() {
        String unknown = RandomUtils.generateRandomId();

        assertThat(mvc.get().uri(VOLUNTEERS + "/{id}", unknown)).hasStatus(404);
        assertThat(patch(unknown, """
                {"status": "paused"}
                """)).hasStatus(404);
        assertThat(delete(unknown)).hasStatus(404);
    }

    // ------------------------------------------------------------------ update

    @Test
    void patchChangesOnlyTheKeysSentAndNullClearsOne() {
        Volunteer volunteer = volunteer("Jane", "Roe");
        volunteer.setGender(Gender.MAN);
        volunteer.setPronouns("They/them");
        volunteer.setCompanyName("Acme");
        volunteer.setJobRole("Senior Developer");
        volunteer.setPhone("+31612345678");
        volunteer.setGithubHandle("janeroe");
        volunteer.setSlackId("U068AQ9G99F");
        volunteer.setLinkedinUrl("https://linkedin.com/in/jane-roe");
        volunteer.setNotes("Checks assignments.");
        volunteerRepository.save(volunteer);

        MvcTestResult result = patch(volunteer.getId(), """
                {"status": "paused", "companyName": null, "gender": "woman", "notes": "Mentors on Tuesdays."}
                """);

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().convertTo(VolunteerResponse.class).satisfies(updated -> {
            // The four keys that were sent.
            assertThat(updated.status()).isEqualTo(VolunteerStatus.PAUSED);
            assertThat(updated.companyName()).isNull();
            assertThat(updated.gender()).isEqualTo(Gender.WOMAN);
            assertThat(updated.notes()).isEqualTo("Mentors on Tuesdays.");
            // Everything else keeps its value.
            assertThat(updated.firstName()).isEqualTo("Jane");
            assertThat(updated.lastName()).isEqualTo("Roe");
            assertThat(updated.pronouns()).isEqualTo("They/them");
            assertThat(updated.jobRole()).isEqualTo("Senior Developer");
            assertThat(updated.email()).isEqualTo(volunteer.getEmail());
            assertThat(updated.phone()).isEqualTo("+31612345678");
            assertThat(updated.githubHandle()).isEqualTo("janeroe");
            assertThat(updated.slackId()).isEqualTo("U068AQ9G99F");
            assertThat(updated.linkedinUrl()).isEqualTo("https://linkedin.com/in/jane-roe");
        });
        verify(slackClient).sendNotification(contains("Volunteer updated"));
        verify(slackClient).sendNotification(contains("| Status | Active | Paused |"));
    }

    @Test
    void aPatchThatChangesNothingPostsNothing() {
        Volunteer volunteer = volunteerRepository.save(volunteer("Jane", "Roe"));

        assertThat(patch(volunteer.getId(), """
                {"status": "active"}
                """)).hasStatusOk();

        verifyNoInteractions(slackClient);
    }

    @Test
    void patchValidatesTheMergedVolunteer() {
        Volunteer volunteer = volunteerRepository.save(volunteer("Jane", "Roe"));

        assertThat(patch(volunteer.getId(), """
                {"firstName": null}
                """)).hasStatus(400);
        assertThat(patch(volunteer.getId(), """
                {"email": null}
                """)).hasStatus(400);
        assertThat(patch(volunteer.getId(), """
                {"status": null}
                """)).hasStatus(400);
        assertThat(patch(volunteer.getId(), """
                {"status": "retired"}
                """)).hasStatus(400);
        assertThat(patch(volunteer.getId(), """
                {"linkedinUrl": "not a url"}
                """)).hasStatus(400);
        assertThat(patch(volunteer.getId(), "{}")).hasStatus(400);
    }

    @Test
    void patchRejectsAnEmailAnotherVolunteerUsesButAcceptsItsOwn() {
        Volunteer first = volunteerRepository.save(volunteer("Jane", "Roe"));
        Volunteer second = volunteerRepository.save(volunteer("John", "Doe"));

        assertThat(patch(second.getId(), "{\"email\": \"" + first.getEmail().toUpperCase(Locale.ROOT) + "\"}"))
                .hasStatus(409);
        // Re-sending its own email in capitals is no change, so it must not conflict with itself.
        MvcTestResult own = patch(second.getId(), "{\"email\": \"" + second.getEmail().toUpperCase(Locale.ROOT)
                + "\"}");
        assertThat(own).hasStatusOk();
        assertThat(own).bodyJson().extractingPath("$.email").isEqualTo(second.getEmail());
    }

    // ------------------------------------------------------------------ delete

    @Test
    void deleteRemovesTheVolunteerAndItsPicture() {
        Volunteer volunteer = volunteerRepository.save(volunteer("Jane", "Roe"));

        assertThat(delete(volunteer.getId())).hasStatus(204);

        assertThat(volunteerRepository.existsById(volunteer.getId())).isFalse();
        verify(fileStorageService).deleteAllWithPrefix("images/volunteers/" + volunteer.getId() + "/");
        verify(slackClient).sendNotification(contains("Volunteer deleted"));
    }

    // ------------------------------------------------------------------ list

    @Test
    void theListIsOrderedByFirstNameIgnoringCaseInEitherDirection() {
        // The shared random prefix keeps local volunteers from sorting between these three.
        String prefix = RandomUtils.generateRandomId();
        Volunteer bravo = volunteerRepository.save(volunteer(prefix + " Bravo", "Roe"));
        Volunteer charlie = volunteerRepository.save(volunteer(prefix + " charlie", "Roe"));
        Volunteer alpha = volunteerRepository.save(volunteer(prefix + " alpha", "Roe"));

        assertThat(ids(everySummary("ASC"))).containsSubsequence(alpha.getId(), bravo.getId(), charlie.getId());
        assertThat(ids(everySummary("DESC"))).containsSubsequence(charlie.getId(), bravo.getId(), alpha.getId());
    }

    @Test
    void theListCarriesTheSummaryFields() {
        Volunteer volunteer = volunteer("Jane", "Roe");
        volunteer.setPictureId("IMGface00001");
        volunteer.setCompanyName("Acme");
        volunteer.setJobRole("Recruiter");
        volunteer.setNotes("Hires interns.");
        volunteerRepository.save(volunteer);

        Map<String, Object> summary = everySummary("ASC").stream()
                .filter(candidate -> volunteer.getId().equals(candidate.get("id")))
                .findFirst()
                .orElseThrow();

        assertThat(summary)
                .containsEntry("displayName", "Jane Roe")
                .containsEntry("profilePath", volunteer.getProfilePath())
                .containsEntry("thumbnailUrl", volunteer.getThumbnailUrl())
                .containsEntry("status", "active")
                .containsEntry("companyName", "Acme")
                .containsEntry("jobRole", "Recruiter")
                .containsEntry("email", volunteer.getEmail())
                .doesNotContainKeys("notes", "pictureUrl");
    }

    @Test
    void pagingParametersOutOfBoundsAreRejected() {
        assertThat(list("?size=101")).hasStatus(400);
        assertThat(list("?size=0")).hasStatus(400);
        assertThat(list("?page=-1")).hasStatus(400);
        assertThat(list("?direction=sideways")).hasStatus(400);
    }

    // ------------------------------------------------------------------ helpers

    private MvcTestResult post(String body) {
        return mvc.post().uri(VOLUNTEERS).header(AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON).content(body).exchange();
    }

    // Unlike the organisation test, PATCH reads the caller too, so it signs in as well.
    private MvcTestResult patch(String id, String body) {
        return mvc.patch().uri(VOLUNTEERS + "/{id}", id).header(AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON).content(body).exchange();
    }

    private MvcTestResult delete(String id) {
        return mvc.delete().uri(VOLUNTEERS + "/{id}", id).header(AUTHORIZATION, "Bearer " + token).exchange();
    }

    private MvcTestResult list(String query) {
        return mvc.get().uri(VOLUNTEERS + query).exchange();
    }

    // A valid create body with one member replaced, so a 400 can only come from that member.
    private String valid(String key, Object value) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("firstName", "Jane");
        body.put("lastName", "Roe");
        body.put("email", RandomUtils.generateRandomId() + "@example.org");
        body.put("status", "active");
        body.put(key, value);
        return objectMapper.writeValueAsString(body);
    }

    // The whole list, page by page, because local volunteers share the table with the seeded ones.
    private List<Map<String, Object>> everySummary(String direction) {
        List<Map<String, Object>> summaries = new ArrayList<>();
        for (int page = 0;; page++) {
            byte[] content = list("?direction=" + direction + "&size=100&page=" + page).getResponse()
                    .getContentAsByteArray();
            List<Map<String, Object>> pageContent = JsonPath.read(new String(content, StandardCharsets.UTF_8),
                    "$.content");
            if (pageContent.isEmpty()) {
                return summaries;
            }
            summaries.addAll(pageContent);
        }
    }

    private static List<Object> ids(List<Map<String, Object>> summaries) {
        return summaries.stream().map(summary -> summary.get("id")).toList();
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
}
