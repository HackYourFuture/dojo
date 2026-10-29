package nl.hackyourfuture.dojoserver.partner.organisation;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.geo.City;
import nl.hackyourfuture.dojoserver.geo.CityRepository;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import org.assertj.core.api.ObjectArrayAssert;
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

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

/**
 * The organisation list filters over MockMvc. Transactional, because it runs against the local development database.
 * The seeded organisations' names start with a random word, which the search words narrow the list down to.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class OrganisationListTest {

    private static final String ORGANISATIONS = "/api/organisations";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private OrganisationRepository organisationRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private CityRepository cityRepository;

    private String seeded;
    private User jane;
    private User omar;
    private City alphaCity;
    private City gammaCity;
    private Organisation alpha;
    private Organisation beta;
    private Organisation gamma;

    @BeforeEach
    void givenThreeOrganisations() {
        // A fixed first letter, so no random name can pass for a half-typed "beta".
        String name = "Org" + RandomUtils.generateRandomId();
        seeded = "?q=" + name;
        jane = userRepository.save(user("Jane"));
        omar = userRepository.save(user("Omar"));
        alphaCity = cityRepository.save(city());
        gammaCity = cityRepository.save(city());

        alpha = organisation(name + " Alpha", OrganisationStatus.ACTIVE, alphaCity,
                Set.of(PartnershipType.VOLUNTEER, PartnershipType.FUNDING), List.of(jane.getId()));
        beta = organisation(name + " Beta", OrganisationStatus.NEVER_ENGAGED, null, Set.of(PartnershipType.EMPLOYMENT),
                List.of(omar.getId(), jane.getId()));
        gamma = organisation(name + " Gamma", OrganisationStatus.INACTIVE, gammaCity, Set.of(), List.of());
        alpha = organisationRepository.save(alpha);
        beta = organisationRepository.save(beta);
        gamma = organisationRepository.save(gamma);
    }

    @Test
    void searchWordsMatchLikeTheSearch() {
        ids(seeded).containsExactly(alpha.getId(), beta.getId(), gamma.getId());
        ids(seeded + " beta").containsExactly(beta.getId());
        ids(seeded + "xyzzy").isEmpty();
        ids("?q= &province=" + alphaCity.getProvince()).containsExactly(alpha.getId());
    }

    @Test
    void aStatusIsGivenByItsConstantName() {
        ids(seeded + "&status=INACTIVE").containsExactly(gamma.getId());
        assertThat(list(seeded + "&status=inactive")).hasStatus(400);
    }

    @Test
    void repeatedStatusesMatchAnyOfThem() {
        ids(seeded + "&status=ACTIVE&status=NEVER_ENGAGED").containsExactly(alpha.getId(), beta.getId());
        ids(seeded + "&status=,INACTIVE").containsExactly(gamma.getId());
    }

    @Test
    void aPartnershipIsGivenByItsConstantName() {
        ids(seeded + "&partnership=FUNDING").containsExactly(alpha.getId());
        assertThat(list(seeded + "&partnership=funding")).hasStatus(400);
    }

    @Test
    void repeatedPartnershipsMatchAnyOfThem() {
        ids(seeded + "&partnership=EMPLOYMENT&partnership=FUNDING").containsExactly(alpha.getId(), beta.getId());
        ids(seeded + "&partnership=EVENTS").isEmpty();
        ids(seeded + "&partnership=,FUNDING").containsExactly(alpha.getId());
    }

    @Test
    void repeatedResponsiblesMatchAnyOfThem() {
        ids(seeded + "&responsibleId=" + jane.getId()).containsExactly(alpha.getId(), beta.getId());
        ids(seeded + "&responsibleId=" + omar.getId()).containsExactly(beta.getId());
        ids(seeded + "&responsibleId=" + omar.getId() + "," + jane.getId())
                .containsExactly(alpha.getId(), beta.getId());
        ids(seeded + "&responsibleId=" + RandomUtils.generateRandomId()).isEmpty();
    }

    @Test
    void theProvinceIsTheOneOfTheCity() {
        ids(seeded + "&province=" + alphaCity.getProvince()).containsExactly(alpha.getId());
        ids(seeded + "&province=" + alphaCity.getProvince() + "&province=" + gammaCity.getProvince())
                .containsExactly(alpha.getId(), gamma.getId());
    }

    @Test
    void theFilteredListStillEmbedsTheCity() {
        assertThat(list(seeded + "&province=" + alphaCity.getProvince())).bodyJson()
                .extractingPath("$.content[0].city.id").isEqualTo(alphaCity.getId());
    }

    @Test
    void everyFilterMustMatch() {
        ids(seeded + "&responsibleId=" + jane.getId() + "&partnership=EMPLOYMENT").containsExactly(beta.getId());
        ids(seeded + "&responsibleId=" + omar.getId() + "&province=" + alphaCity.getProvince()).isEmpty();
        ids(seeded + "&status=NEVER_ENGAGED&responsibleId=" + jane.getId()).containsExactly(beta.getId());
        ids(seeded + "&status=ACTIVE&partnership=EMPLOYMENT").isEmpty();
    }

    @Test
    void theExportIsACsvDownloadWithTheCityAndTheResponsiblesByName() {
        MvcTestResult result = export(seeded);
        assertThat(result).hasStatusOk();
        assertThat(result).hasContentType(new MediaType("text", "csv", StandardCharsets.UTF_8));
        assertThat(result).headers().hasValue("Content-Disposition",
                "attachment; filename=\"organisations-" + LocalDate.now() + ".csv\"");

        String[] lines = csv(result).split("\r\n");
        assertThat(lines).hasSize(4);
        assertThat(lines[0]).isEqualTo(
                "\uFEFFName,Website URL,LinkedIn URL,City,Province,Status,Partnership types,Responsibles,Notes");
        assertThat(lines[1]).isEqualTo(alpha.getName() + ",,," + alphaCity.getName() + "," + alphaCity.getProvince()
                + ",Active,Funding; Volunteer,Jane,");
        assertThat(lines[2]).isEqualTo(beta.getName() + ",,,,,Never engaged,Employment,Omar; Jane,");
        assertThat(lines[3]).isEqualTo(gamma.getName() + ",,," + gammaCity.getName() + "," + gammaCity.getProvince()
                + ",Inactive,,,");
    }

    @Test
    void theExportAppliesTheFilters() {
        String[] lines = csv(export(seeded + "&status=NEVER_ENGAGED")).split("\r\n");
        assertThat(lines).hasSize(2);
        assertThat(lines[1]).startsWith(beta.getName() + ",");
    }

    private MvcTestResult list(String query) {
        return mvc.get().uri(ORGANISATIONS + query).exchange();
    }

    private MvcTestResult export(String query) {
        return mvc.get().uri(ORGANISATIONS + "/export" + query).exchange();
    }

    // The body decoded as the UTF-8 it is declared as.
    private static String csv(MvcTestResult result) {
        return new String(result.getResponse().getContentAsByteArray(), StandardCharsets.UTF_8);
    }

    private ObjectArrayAssert<Object> ids(String query) {
        return assertThat(list(query)).bodyJson().extractingPath("$.content[*].id").asArray();
    }

    private static User user(String name) {
        return User.builder()
                .id(RandomUtils.generateRandomId())
                .email(RandomUtils.generateRandomId() + "@example.org")
                .name(name)
                .isActive(true)
                .build();
    }

    // Its province is as unique as its id, so only the seeded organisations can be in it.
    private static City city() {
        String id = RandomUtils.generateRandomId();
        return City.builder()
                .id(id)
                .name("Stad " + id)
                .population(1)
                .province("Provincie" + id)
                .region("Midden-Utrecht")
                .latitude(52.09)
                .longitude(5.12)
                .build();
    }

    private static Organisation organisation(String name, OrganisationStatus status, City city,
            Set<PartnershipType> partnershipTypes, List<String> responsibleIds) {
        return Organisation.builder()
                .id(RandomUtils.generateRandomId())
                .name(name)
                .city(city)
                .status(status)
                .partnershipTypes(partnershipTypes)
                .responsibleIds(responsibleIds)
                .build();
    }
}
