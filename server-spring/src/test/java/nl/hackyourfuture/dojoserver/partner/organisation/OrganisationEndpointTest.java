package nl.hackyourfuture.dojoserver.partner.organisation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.verify;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

import com.jayway.jsonpath.JsonPath;
import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.authentication.token.TokenService;
import nl.hackyourfuture.dojoserver.authentication.token.TokenType;
import nl.hackyourfuture.dojoserver.filestorage.FileStorageService;
import nl.hackyourfuture.dojoserver.partner.contactperson.ContactPerson;
import nl.hackyourfuture.dojoserver.partner.contactperson.ContactPersonRepository;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationResponse;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.slack.SlackClient;
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

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * The organisation endpoints over MockMvc. Transactional, because it runs against the local development database,
 * whose own organisations share the list with the seeded ones. Storage is mocked because CI has no S3, and Slack
 * so nothing is posted. Create and delete read the caller, so they sign in with a real token.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class OrganisationEndpointTest {

    private static final String ORGANISATIONS = "/api/organisations";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private ContactPersonRepository contactPersonRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TokenService tokenService;
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
    void createReturnsTheOrganisationWithItsIdAndPath() {
        MvcTestResult result = post("""
                {"name": "  Acme B.V. ", "websiteUrl": "https://acme.example", "status": "never-engaged"}
                """);

        assertThat(result).hasStatus(201);
        assertThat(result).bodyJson().convertTo(OrganisationResponse.class).satisfies(created -> {
            assertThat(created.name()).isEqualTo("Acme B.V.");
            assertThat(created.status()).isEqualTo(OrganisationStatus.NEVER_ENGAGED);
            assertThat(created.websiteUrl()).isEqualTo("https://acme.example");
            assertThat(created.pictureUrl()).isNull();
            assertThat(created.thumbnailUrl()).isNull();
            assertThat(created.profilePath()).isEqualTo("/organisation/acme-b-v_" + created.id());
            assertThat(organisationRepository.findById(created.id())).isPresent();
            verify(slackClient).sendNotification(contains(created.profilePath()));
        });
    }

    @Test
    void createRejectsAMissingNameOrStatus() {
        assertThat(post("""
                {"status": "active"}
                """)).hasStatus(400);
        assertThat(post("""
                {"name": "  ", "status": "active"}
                """)).hasStatus(400);
        assertThat(post("""
                {"name": "Acme"}
                """)).hasStatus(400);
    }

    @Test
    void createRejectsAnUnknownStatus() {
        assertThat(post("""
                {"name": "Acme", "status": "prospect"}
                """)).hasStatus(400);
    }

    @Test
    void createRejectsInvalidUrls() {
        assertThat(post("""
                {"name": "Acme", "status": "active", "websiteUrl": "acme.example"}
                """)).hasStatus(400);
        assertThat(post("""
                {"name": "Acme", "status": "active", "websiteUrl": "javascript:alert(1)"}
                """)).hasStatus(400);
        assertThat(post("""
                {"name": "Acme", "status": "active", "linkedinUrl": ""}
                """)).hasStatus(400);
    }

    // ------------------------------------------------------------------ read

    @Test
    void getReturnsTheOrganisation() {
        Organisation organisation = organisationRepository.save(organisation("Acme"));

        MvcTestResult result = mvc.get().uri(ORGANISATIONS + "/{id}", organisation.getId()).exchange();

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.name").isEqualTo(organisation.getName());
        assertThat(result).bodyJson().extractingPath("$.status").isEqualTo("active");
        assertThat(result).bodyJson().extractingPath("$.profilePath").isEqualTo(organisation.getProfilePath());
    }

    @Test
    void anUnknownIdIsNotFound() {
        String unknown = RandomUtils.generateRandomId();

        assertThat(mvc.get().uri(ORGANISATIONS + "/{id}", unknown)).hasStatus(404);
        assertThat(patch(unknown, """
                {"status": "inactive"}
                """)).hasStatus(404);
        assertThat(delete(unknown)).hasStatus(404);
    }

    // ------------------------------------------------------------------ update

    @Test
    void patchChangesOnlyTheKeysSentAndNullClearsOne() {
        Organisation organisation = organisation("Acme");
        organisation.setLocation("Amsterdam");
        organisation.setNotes("Hires interns.");
        organisationRepository.save(organisation);

        MvcTestResult result = patch(organisation.getId(), """
                {"status": "inactive", "location": null}
                """);

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.status").isEqualTo("inactive");
        assertThat(result).bodyJson().extractingPath("$.location").isNull();
        assertThat(result).bodyJson().extractingPath("$.notes").isEqualTo("Hires interns.");
        assertThat(result).bodyJson().extractingPath("$.name").isEqualTo(organisation.getName());
    }

    @Test
    void patchValidatesTheMergedOrganisation() {
        Organisation organisation = organisationRepository.save(organisation("Acme"));

        assertThat(patch(organisation.getId(), """
                {"name": null}
                """)).hasStatus(400);
        assertThat(patch(organisation.getId(), """
                {"websiteUrl": "not a url"}
                """)).hasStatus(400);
        assertThat(patch(organisation.getId(), "{}")).hasStatus(400);
    }

    // ------------------------------------------------------------------ delete

    @Test
    void deleteRemovesTheOrganisationItsContactPersonsAndItsLogo() {
        Organisation organisation = organisationRepository.save(organisation("Acme"));
        ContactPerson contactPerson = contactPersonRepository.save(ContactPerson.builder()
                .id(RandomUtils.generateRandomId())
                .organisationId(organisation.getId())
                .name("Jane Roe")
                .build());

        assertThat(delete(organisation.getId())).hasStatus(204);

        // The cascade runs in the database, so write the delete before asking it.
        organisationRepository.flush();
        assertThat(organisationRepository.existsById(organisation.getId())).isFalse();
        assertThat(contactPersonRepository.existsById(contactPerson.getId())).isFalse();
        verify(fileStorageService).deleteAllWithPrefix("images/organisations/" + organisation.getId() + "/");
        verify(slackClient).sendNotification(contains("Organisation deleted"));
    }

    // ------------------------------------------------------------------ list

    @Test
    void theListIsOrderedByNameIgnoringCaseInEitherDirection() {
        // The shared random prefix keeps local organisations from sorting between these three.
        String prefix = RandomUtils.generateRandomId();
        Organisation bravo = organisationRepository.save(organisation(prefix + " Bravo"));
        Organisation charlie = organisationRepository.save(organisation(prefix + " charlie"));
        Organisation alpha = organisationRepository.save(organisation(prefix + " alpha"));

        assertThat(ids(everySummary("ASC"))).containsSubsequence(alpha.getId(), bravo.getId(), charlie.getId());
        assertThat(ids(everySummary("DESC"))).containsSubsequence(charlie.getId(), bravo.getId(), alpha.getId());
    }

    @Test
    void theListCarriesTheSummaryFields() {
        Organisation organisation = organisation("Acme");
        organisation.setPictureId("IMGlogo0001");
        organisation.setNotes("Hires interns.");
        organisationRepository.save(organisation);

        Map<String, Object> summary = everySummary("ASC").stream()
                .filter(candidate -> organisation.getId().equals(candidate.get("id")))
                .findFirst()
                .orElseThrow();

        assertThat(summary)
                .containsEntry("profilePath", organisation.getProfilePath())
                .containsEntry("thumbnailUrl", organisation.getThumbnailUrl())
                .containsEntry("status", "active")
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
        return mvc.post().uri(ORGANISATIONS).header(AUTHORIZATION, "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON).content(body).exchange();
    }

    private MvcTestResult delete(String id) {
        return mvc.delete().uri(ORGANISATIONS + "/{id}", id).header(AUTHORIZATION, "Bearer " + token).exchange();
    }

    private MvcTestResult patch(String id, String body) {
        return mvc.patch().uri(ORGANISATIONS + "/{id}", id).contentType(MediaType.APPLICATION_JSON).content(body)
                .exchange();
    }

    private MvcTestResult list(String query) {
        return mvc.get().uri(ORGANISATIONS + query).exchange();
    }

    // The whole list, page by page, because local organisations share the table with the seeded ones.
    private List<Map<String, Object>> everySummary(String direction) {
        List<Map<String, Object>> summaries = new ArrayList<>();
        for (int page = 0;; page++) {
            byte[] body = list("?direction=" + direction + "&size=100&page=" + page).getResponse()
                    .getContentAsByteArray();
            List<Map<String, Object>> content = JsonPath.read(new String(body, StandardCharsets.UTF_8), "$.content");
            if (content.isEmpty()) {
                return summaries;
            }
            summaries.addAll(content);
        }
    }

    private static List<Object> ids(List<Map<String, Object>> summaries) {
        return summaries.stream().map(summary -> summary.get("id")).toList();
    }

    private static Organisation organisation(String name) {
        return Organisation.builder()
                .id(RandomUtils.generateRandomId())
                .name(name)
                .status(OrganisationStatus.ACTIVE)
                .build();
    }
}
