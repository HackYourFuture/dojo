package nl.hackyourfuture.dojoserver.search;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.partner.contactperson.ContactPerson;
import nl.hackyourfuture.dojoserver.partner.contactperson.ContactPersonRepository;
import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;
import nl.hackyourfuture.dojoserver.partner.organisation.OrganisationRepository;
import nl.hackyourfuture.dojoserver.search.dto.SearchResult;
import nl.hackyourfuture.dojoserver.shared.SearchMatcher;
import nl.hackyourfuture.dojoserver.shared.SearchMatcher.Field;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import nl.hackyourfuture.dojoserver.volunteer.Volunteer;
import nl.hackyourfuture.dojoserver.volunteer.VolunteerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class SearchService {
    private static final int MAX_RESULTS = 20;

    private final TraineeRepository traineeRepository;
    private final VolunteerRepository volunteerRepository;
    private final OrganisationRepository organisationRepository;
    private final ContactPersonRepository contactPersonRepository;

    @Transactional(readOnly = true)
    public List<SearchResult> search(String query) {
        List<String> tokens = SearchMatcher.tokenize(query);
        if (tokens.isEmpty()) {
            return List.of();
        }
        // Every record is scored: close spellings mean no database index can narrow the candidates.
        return rank(
                traineeRepository.findAll(),
                volunteerRepository.findAll(),
                organisationRepository.findAll(),
                contactPersonRepository.findAll(),
                tokens
        ).stream().limit(MAX_RESULTS).toList();
    }

    // Every matching record, best first. The sort is stable, so equal scores put trainees first, then volunteers,
    // then organisations, then contact persons, each in its own order.
    static List<SearchResult> rank(List<Trainee> trainees, List<Volunteer> volunteers,
            List<Organisation> organisations, List<ContactPerson> contactPersons, List<String> tokens) {
        Map<String, Organisation> organisationsById = organisations.stream()
                .collect(Collectors.toMap(Organisation::getId, Function.identity()));
        return Stream.of(
                rankTrainees(trainees, tokens),
                rankVolunteers(volunteers, tokens),
                rankOrganisations(organisations, tokens),
                rankContactPersons(contactPersons, organisationsById, tokens))
                .flatMap(List::stream)
                .sorted(Comparator.comparingDouble(SearchResult::score).reversed())
                .toList();
    }

    // The matching trainees, best first. Equal scores go by newest cohort, then name; the id keeps the order stable.
    static List<SearchResult> rankTrainees(List<Trainee> trainees, List<String> tokens) {
        Comparator<Trainee> ties = Comparator
                .comparing(Trainee::getCurrentCohort, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(Trainee::getDisplayName)
                .thenComparing(Trainee::getId);
        return SearchMatcher.rank(trainees, tokens, SearchService::traineeFields, ties).stream()
                .map(hit -> SearchResult.from(hit.item(), hit.score()))
                .toList();
    }

    // The matching volunteers, best first. Equal scores go by name; the id keeps the order stable.
    static List<SearchResult> rankVolunteers(List<Volunteer> volunteers, List<String> tokens) {
        Comparator<Volunteer> ties = Comparator.comparing(Volunteer::getDisplayName).thenComparing(Volunteer::getId);
        return SearchMatcher.rank(volunteers, tokens, SearchService::volunteerFields, ties).stream()
                .map(hit -> SearchResult.from(hit.item(), hit.score()))
                .toList();
    }

    // The matching organisations, best first. Equal scores go by name; the id keeps the order stable.
    static List<SearchResult> rankOrganisations(List<Organisation> organisations, List<String> tokens) {
        Comparator<Organisation> ties = Comparator.comparing(Organisation::getName)
                .thenComparing(Organisation::getId);
        return SearchMatcher.rank(organisations, tokens, SearchService::organisationFields, ties).stream()
                .map(hit -> SearchResult.from(hit.item(), hit.score()))
                .toList();
    }

    // The matching contact persons, best first. Equal scores go by name; the id keeps the order stable.
    static List<SearchResult> rankContactPersons(List<ContactPerson> contactPersons,
            Map<String, Organisation> organisationsById, List<String> tokens) {
        Comparator<ContactPerson> ties = Comparator.comparing(ContactPerson::getName)
                .thenComparing(ContactPerson::getId);
        return SearchMatcher.rank(contactPersons, tokens, SearchService::contactPersonFields, ties).stream()
                .map(hit -> SearchResult.from(hit.item(), organisationsById.get(hit.item().getOrganisationId()),
                        hit.score()))
                .toList();
    }

    // The fields staff search trainees by, the most used first.
    private static List<Field> traineeFields(Trainee trainee) {
        return List.of(
                Field.name(trainee.getCalledName(), 5),
                Field.name(trainee.getFirstName(), 4),
                Field.name(trainee.getLastName(), 3),
                Field.text(trainee.getEmail(), 2),
                Field.text(trainee.getGithubHandle(), 1),
                // Far below the other weights on purpose: a word in the notes never outranks a match elsewhere.
                Field.text(trainee.getComments(), 0.001));
    }

    // The first name weighs 5, like a trainee's called name, so ties fall to the merge order.
    private static List<Field> volunteerFields(Volunteer volunteer) {
        return List.of(
                Field.name(volunteer.getFirstName(), 5),
                Field.name(volunteer.getLastName(), 3),
                Field.text(volunteer.getEmail(), 2),
                Field.text(volunteer.getGithubHandle(), 1),
                Field.text(volunteer.getCompanyName(), 1),
                Field.text(withoutDots(volunteer.getCompanyName()), 1),
                Field.text(volunteer.getJobRole(), 1),
                Field.text(volunteer.getNotes(), 0.001));
    }

    private static List<Field> organisationFields(Organisation organisation) {
        String name = organisation.getName();
        return List.of(
                Field.name(name, 5),
                Field.name(withoutDots(name), 5),
                Field.text(organisation.getWebsiteUrl(), 3),
                Field.text(organisation.getNotes(), 0.001));
    }

    // The name weighs 3, like a trainee's last name, so a contact person never outranks a trainee of the same name.
    private static List<Field> contactPersonFields(ContactPerson contactPerson) {
        return List.of(
                Field.name(contactPerson.getName(), 3),
                Field.text(contactPerson.getEmail(), 2),
                Field.text(contactPerson.getJobTitle(), 1),
                Field.text(contactPerson.getNotes(), 0.001));
    }

    // Search keeps dots and underscores inside words, so without them "coolblue bv" finds "Coolblue B.V.".
    private static String withoutDots(String name) {
        return name == null ? null : name.replace('.', ' ').replace('_', ' ');
    }
}
