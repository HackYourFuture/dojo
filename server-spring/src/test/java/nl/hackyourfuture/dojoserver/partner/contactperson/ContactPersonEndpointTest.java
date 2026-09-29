package nl.hackyourfuture.dojoserver.partner.contactperson;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;
import nl.hackyourfuture.dojoserver.partner.organisation.OrganisationRepository;
import nl.hackyourfuture.dojoserver.partner.organisation.OrganisationStatus;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
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

/**
 * The contact person endpoints over MockMvc. Transactional, because it runs against the local development database.
 * Every contact person belongs to an organisation seeded here, so local data never shows up.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class ContactPersonEndpointTest {

    private static final String CONTACT_PERSONS = "/api/organisations/{organisationId}/contact-persons";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private ContactPersonRepository contactPersonRepository;

    private Organisation acme;
    private Organisation globex;

    @BeforeEach
    void givenTwoOrganisations() {
        acme = organisationRepository.save(organisation("Acme"));
        globex = organisationRepository.save(organisation("Globex"));
    }

    @Test
    void createAddsANormalisedContactPersonToTheOrganisation() {
        MvcTestResult result = post(acme.getId(), """
                {"name": " Jane Roe ", "email": " Jane.Roe@Example.COM ", "jobTitle": "Recruiter"}
                """);

        assertThat(result).hasStatus(201);
        assertThat(result).bodyJson().extractingPath("$.name").isEqualTo("Jane Roe");
        assertThat(result).bodyJson().extractingPath("$.email").isEqualTo("jane.roe@example.com");
        assertThat(result).bodyJson().extractingPath("$.jobTitle").isEqualTo("Recruiter");
        assertThat(result).bodyJson().extractingPath("$.phone").isNull();
        assertThat(list(acme.getId())).bodyJson().extractingPath("$[*].name").asArray().containsExactly("Jane Roe");
    }

    @Test
    void createRejectsAnInvalidBody() {
        assertThat(post(acme.getId(), """
                {"email": "jane.roe@example.com"}
                """)).hasStatus(400);
        assertThat(post(acme.getId(), """
                {"name": "Jane Roe", "email": "not an email"}
                """)).hasStatus(400);
        assertThat(post(acme.getId(), """
                {"name": "Jane Roe", "linkedinUrl": "linkedin.com/in/jane-roe"}
                """)).hasStatus(400);
    }

    @Test
    void theListHoldsOnlyTheOrganisationsContactPersonsOrderedByNameIgnoringCase() {
        ContactPerson zoe = contactPersonRepository.save(contactPerson(acme, "Zoe Zee"));
        ContactPerson bea = contactPersonRepository.save(contactPerson(acme, "bea de Vries"));
        ContactPerson adam = contactPersonRepository.save(contactPerson(acme, "Adam Ant"));
        contactPersonRepository.save(contactPerson(globex, "Bob Globex"));

        assertThat(list(acme.getId())).bodyJson().extractingPath("$[*].id").asArray()
                .containsExactly(adam.getId(), bea.getId(), zoe.getId());
    }

    @Test
    void updateReplacesEveryField() {
        ContactPerson contactPerson = contactPerson(acme, "Jane Roe");
        contactPerson.setJobTitle("Recruiter");
        contactPersonRepository.save(contactPerson);

        MvcTestResult result = put(acme.getId(), contactPerson.getId(), """
                {"name": "Jane Doe", "phone": "+31612345678"}
                """);

        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.name").isEqualTo("Jane Doe");
        assertThat(result).bodyJson().extractingPath("$.phone").isEqualTo("+31612345678");
        assertThat(result).bodyJson().extractingPath("$.jobTitle").isNull();
    }

    @Test
    void deleteRemovesTheContactPerson() {
        ContactPerson contactPerson = contactPersonRepository.save(contactPerson(acme, "Jane Roe"));

        assertThat(mvc.delete().uri(CONTACT_PERSONS + "/{id}", acme.getId(), contactPerson.getId())).hasStatus(204);

        assertThat(list(acme.getId())).bodyJson().isEqualTo("[]");
    }

    @Test
    void anUnknownOrganisationIsNotFound() {
        String unknown = RandomUtils.generateRandomId();

        assertThat(list(unknown)).hasStatus(404);
        assertThat(post(unknown, """
                {"name": "Jane Roe"}
                """)).hasStatus(404);
    }

    @Test
    void aContactPersonIsNotFoundUnderAnotherOrganisation() {
        ContactPerson contactPerson = contactPersonRepository.save(contactPerson(acme, "Jane Roe"));

        assertThat(put(globex.getId(), contactPerson.getId(), """
                {"name": "Jane Doe"}
                """)).hasStatus(404);
        assertThat(mvc.delete().uri(CONTACT_PERSONS + "/{id}", globex.getId(), contactPerson.getId()))
                .hasStatus(404);
        assertThat(list(acme.getId())).bodyJson().extractingPath("$[0].name").isEqualTo("Jane Roe");
    }

    // ------------------------------------------------------------------ helpers

    private MvcTestResult list(String organisationId) {
        return mvc.get().uri(CONTACT_PERSONS, organisationId).exchange();
    }

    private MvcTestResult post(String organisationId, String body) {
        return mvc.post().uri(CONTACT_PERSONS, organisationId).contentType(MediaType.APPLICATION_JSON).content(body)
                .exchange();
    }

    private MvcTestResult put(String organisationId, String id, String body) {
        return mvc.put().uri(CONTACT_PERSONS + "/{id}", organisationId, id).contentType(MediaType.APPLICATION_JSON)
                .content(body).exchange();
    }

    private static Organisation organisation(String name) {
        return Organisation.builder()
                .id(RandomUtils.generateRandomId())
                .name(name)
                .status(OrganisationStatus.ACTIVE)
                .build();
    }

    private static ContactPerson contactPerson(Organisation organisation, String name) {
        return ContactPerson.builder()
                .id(RandomUtils.generateRandomId())
                .organisationId(organisation.getId())
                .name(name)
                .build();
    }
}
