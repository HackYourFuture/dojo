package nl.hackyourfuture.dojoserver.volunteer;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.mentorship.Mentorship;
import nl.hackyourfuture.dojoserver.mentorship.MentorshipRepository;
import nl.hackyourfuture.dojoserver.mentorship.MentorshipType;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.trainee.profile.JobPath;
import nl.hackyourfuture.dojoserver.trainee.profile.LearningStatus;
import nl.hackyourfuture.dojoserver.trainee.profile.Track;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
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

import java.time.LocalDate;
import java.util.Set;

/**
 * The volunteer list filters over MockMvc. Transactional, because it runs against the local development database.
 * The seeded volunteers share a random last name, which the search words narrow the list down to.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class VolunteerListTest {

    private static final String VOLUNTEERS = "/api/volunteers";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private VolunteerRepository volunteerRepository;
    @Autowired
    private TraineeRepository traineeRepository;
    @Autowired
    private MentorshipRepository mentorshipRepository;

    private String seeded;
    private Volunteer annabel;
    private Volunteer bob;
    private Volunteer cameron;

    @BeforeEach
    void givenThreeVolunteers() {
        String lastName = RandomUtils.generateRandomId();
        seeded = "?q=" + lastName;
        annabel = volunteerRepository.save(volunteer("Annabel", lastName, VolunteerStatus.ACTIVE,
                Set.of(VolunteerType.TECH), Set.of(VolunteerExpertise.BACKEND),
                Set.of(VolunteerAssignmentType.TEACHING)));
        bob = volunteerRepository.save(volunteer("Bob", lastName, VolunteerStatus.PAUSED,
                Set.of(VolunteerType.PERSONAL_DEVELOPMENT),
                Set.of(VolunteerExpertise.HR_MENTOR, VolunteerExpertise.ENGLISH_MENTOR),
                Set.of(VolunteerAssignmentType.TECH_INTERVIEW, VolunteerAssignmentType.HR_MENTORSHIP)));
        cameron = volunteerRepository.save(volunteer("Cameron", lastName, VolunteerStatus.STOPPED,
                Set.of(VolunteerType.TECH, VolunteerType.PERSONAL_DEVELOPMENT), Set.of(), Set.of()));
    }

    @Test
    void searchWordsMatchLikeTheSearch() {
        ids(seeded).containsExactly(annabel.getId(), bob.getId(), cameron.getId());
        ids("?q=annabel " + annabel.getLastName()).containsExactly(annabel.getId());
        ids("?q=xyzzy" + annabel.getLastName()).isEmpty();
        assertThat(list("?q= ")).bodyJson().extractingPath("$.page.totalElements")
                .isEqualTo((int) volunteerRepository.count());
    }

    @Test
    void aStatusIsGivenByItsConstantName() {
        ids(seeded + "&status=PAUSED").containsExactly(bob.getId());
        assertThat(list(seeded + "&status=paused")).hasStatus(400);
    }

    @Test
    void repeatedStatusesMatchAnyOfThem() {
        ids(seeded + "&status=ACTIVE&status=STOPPED").containsExactly(annabel.getId(), cameron.getId());
    }

    @Test
    void aTypeMatchesEveryVolunteerOfThatType() {
        ids(seeded + "&type=TECH").containsExactly(annabel.getId(), cameron.getId());
        ids(seeded + "&type=PERSONAL_DEVELOPMENT").containsExactly(bob.getId(), cameron.getId());
        ids(seeded + "&type=TECH,PERSONAL_DEVELOPMENT").containsExactly(annabel.getId(), bob.getId(), cameron.getId());
        ids(seeded + "&type=,TECH").containsExactly(annabel.getId(), cameron.getId());
    }

    @Test
    void repeatedExpertiseMatchesAnyOfThem() {
        ids(seeded + "&expertise=BACKEND").containsExactly(annabel.getId());
        ids(seeded + "&expertise=HR_MENTOR&expertise=BACKEND").containsExactly(annabel.getId(), bob.getId());
        ids(seeded + "&expertise=CLOUD").isEmpty();
        ids(seeded + "&expertise=,").isEmpty();
    }

    @Test
    void repeatedRolePreferencesMatchAnyOfThem() {
        ids(seeded + "&rolePreference=TEACHING").containsExactly(annabel.getId());
        ids(seeded + "&rolePreference=HR_MENTORSHIP&rolePreference=TEACHING")
                .containsExactly(annabel.getId(), bob.getId());
        ids(seeded + "&rolePreference=WORKSHOP_HOST").isEmpty();
        ids(seeded + "&rolePreference=,TEACHING").containsExactly(annabel.getId());
        assertThat(list(seeded + "&rolePreference=teaching")).hasStatus(400);
    }

    @Test
    void everyFilterMustMatch() {
        ids(seeded + "&type=TECH&status=STOPPED").containsExactly(cameron.getId());
        ids(seeded + "&type=TECH&expertise=HR_MENTOR").isEmpty();
        ids(seeded + "&type=PERSONAL_DEVELOPMENT&rolePreference=TECH_INTERVIEW").containsExactly(bob.getId());
        ids(seeded + "&status=ACTIVE&rolePreference=TECH_INTERVIEW").isEmpty();
    }

    @Test
    void theDirectionStillOrdersTheFilteredList() {
        ids(seeded + "&type=TECH&direction=DESC").containsExactly(cameron.getId(), annabel.getId());
    }

    @Test
    void onlyMentorshipsThatHaveNotEndedCount() {
        Trainee trainee = traineeRepository.save(trainee());
        LocalDate today = LocalDate.now();
        mentorshipRepository.save(mentorship(annabel, trainee, null));
        mentorshipRepository.save(mentorship(annabel, trainee, today.plusDays(1)));
        // The end date itself counts as ended.
        mentorshipRepository.save(mentorship(annabel, trainee, today));
        mentorshipRepository.save(mentorship(bob, trainee, today.minusDays(1)));

        assertThat(list(seeded)).bodyJson().extractingPath("$.content[*].activeMentorshipCount").asArray()
                .containsExactly(2, 0, 0);
    }

    @Test
    void pairedMatchesVolunteersWithAnActiveMentorship() {
        Trainee trainee = traineeRepository.save(trainee());
        mentorshipRepository.save(mentorship(annabel, trainee, null));
        mentorshipRepository.save(mentorship(annabel, trainee, LocalDate.now().plusDays(1)));
        mentorshipRepository.save(mentorship(bob, trainee, LocalDate.now()));

        ids(seeded + "&paired=true").containsExactly(annabel.getId());
        ids(seeded + "&paired=false").containsExactly(bob.getId(), cameron.getId());
        ids(seeded + "&paired=true&paired=false").containsExactly(annabel.getId(), bob.getId(), cameron.getId());
        ids(seeded + "&paired=false&status=STOPPED").containsExactly(cameron.getId());
        ids(seeded + "&paired=,true").containsExactly(annabel.getId());
        ids(seeded + "&paired=,").isEmpty();
        assertThat(list(seeded + "&paired=maybe")).hasStatus(400);
    }

    @Test
    void pairedIsFilteredBeforeThePaging() {
        mentorshipRepository.save(mentorship(cameron, traineeRepository.save(trainee()), null));

        MvcTestResult result = list(seeded + "&paired=false&size=1&page=1");
        assertThat(result).bodyJson().extractingPath("$.content[*].id").asArray().containsExactly(bob.getId());
        assertThat(result).bodyJson().extractingPath("$.page.totalElements").isEqualTo(2);
    }

    private MvcTestResult list(String query) {
        return mvc.get().uri(VOLUNTEERS + query).exchange();
    }

    private ObjectArrayAssert<Object> ids(String query) {
        return assertThat(list(query)).bodyJson().extractingPath("$.content[*].id").asArray();
    }

    private static Volunteer volunteer(String firstName, String lastName, VolunteerStatus status,
            Set<VolunteerType> types, Set<VolunteerExpertise> expertise,
            Set<VolunteerAssignmentType> rolePreferences) {
        return Volunteer.builder()
                .id(RandomUtils.generateRandomId())
                .firstName(firstName)
                .lastName(lastName)
                .email(RandomUtils.generateRandomId().toLowerCase() + "@example.org")
                .status(status)
                .volunteerTypes(types)
                .expertise(expertise)
                .rolePreferences(rolePreferences)
                .build();
    }

    // Cohort 9001 keeps the trainee apart from local data.
    private static Trainee trainee() {
        return Trainee.builder()
                .id(RandomUtils.generateRandomId())
                .firstName("Ann")
                .lastName("Mentored")
                .email(RandomUtils.generateRandomId().toLowerCase() + "@example.org")
                .startCohort(9001)
                .track(Track.CORE_PROGRAM)
                .learningStatus(LearningStatus.STUDYING)
                .jobPath(JobPath.NOT_GRADUATED)
                .build();
    }

    private static Mentorship mentorship(Volunteer volunteer, Trainee trainee, LocalDate endDate) {
        return Mentorship.builder()
                .id(RandomUtils.generateRandomId())
                .volunteer(volunteer)
                .trainee(trainee)
                .type(MentorshipType.TECH_MENTORSHIP)
                .startDate(LocalDate.now().minusMonths(1))
                .endDate(endDate)
                .build();
    }
}
