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
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

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

        alpha = organisation(name + " Alpha", alphaCity, Set.of(PartnershipType.VOLUNTEER, PartnershipType.FUNDING),
                List.of(jane.getId()));
        beta = organisation(name + " Beta", null, Set.of(PartnershipType.EMPLOYMENT),
                List.of(omar.getId(), jane.getId()));
        gamma = organisation(name + " Gamma", gammaCity, Set.of(), List.of());
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
    }

    private MvcTestResult list(String query) {
        return mvc.get().uri(ORGANISATIONS + query).exchange();
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

    private static Organisation organisation(String name, City city, Set<PartnershipType> partnershipTypes,
            List<String> responsibleIds) {
        return Organisation.builder()
                .id(RandomUtils.generateRandomId())
                .name(name)
                .city(city)
                .status(OrganisationStatus.ACTIVE)
                .partnershipTypes(partnershipTypes)
                .responsibleIds(responsibleIds)
                .build();
    }
}
