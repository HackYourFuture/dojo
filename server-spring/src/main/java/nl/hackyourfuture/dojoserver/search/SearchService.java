package nl.hackyourfuture.dojoserver.search;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.partner.contactperson.ContactPerson;
import nl.hackyourfuture.dojoserver.partner.contactperson.ContactPersonRepository;
import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;
import nl.hackyourfuture.dojoserver.partner.organisation.OrganisationRepository;
import nl.hackyourfuture.dojoserver.search.SearchMatcher.Field;
import nl.hackyourfuture.dojoserver.search.dto.SearchResult;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
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
    private final OrganisationRepository organisationRepository;
    private final ContactPersonRepository contactPersonRepository;

    @Transactional(readOnly = true)
    public List<SearchResult> search(String query) {
        List<String> tokens = SearchMatcher.tokenize(query);
        if (tokens.isEmpty()) {
            return List.of();
        }
        // Every record is scored: close spellings mean no database index can narrow the candidates.
        return rank(traineeRepository.findAll(), organisationRepository.findAll(), contactPersonRepository.findAll(),
                tokens).stream().limit(MAX_RESULTS).toList();
    }

    // Every matching record, best first. The sort is stable, so equal scores put trainees first, then organisations,
    // then contact persons, each in its own order.
    static List<SearchResult> rank(List<Trainee> trainees, List<Organisation> organisations,
            List<ContactPerson> contactPersons, List<String> tokens) {
        Map<String, Organisation> organisationsById = organisations.stream()
                .collect(Collectors.toMap(Organisation::getId, Function.identity()));
        return Stream.of(
                rankTrainees(trainees, tokens),
                rankOrganisations(organisations, tokens),
                rankContactPersons(contactPersons, organisationsById, tokens))
                .flatMap(List::stream)
                .sorted(Comparator.comparingDouble(SearchResult::score).reversed())
                .toList();
    }

    // The matching trainees, best first. Equal scores put the newest cohort first; the id keeps the order stable.
    static List<SearchResult> rankTrainees(List<Trainee> trainees, List<String> tokens) {
        record Hit(Trainee trainee, double score) {
        }
        return trainees.stream()
                .map(trainee -> new Hit(trainee, SearchMatcher.score(tokens, traineeFields(trainee))))
                .filter(hit -> hit.score() > 0)
                .sorted(Comparator.comparingDouble(Hit::score).reversed()
                        .thenComparing(hit -> hit.trainee().getCurrentCohort(),
                                Comparator.nullsLast(Comparator.reverseOrder()))
                        .thenComparing(hit -> hit.trainee().getDisplayName())
                        .thenComparing(hit -> hit.trainee().getId()))
                .map(hit -> SearchResult.from(hit.trainee(), hit.score()))
                .toList();
    }

    // The matching organisations, best first. Equal scores go by name; the id keeps the order stable.
    static List<SearchResult> rankOrganisations(List<Organisation> organisations, List<String> tokens) {
        record Hit(Organisation organisation, double score) {
        }
        return organisations.stream()
                .map(organisation -> new Hit(organisation,
                        SearchMatcher.score(tokens, organisationFields(organisation))))
                .filter(hit -> hit.score() > 0)
                .sorted(Comparator.comparingDouble(Hit::score).reversed()
                        .thenComparing(hit -> hit.organisation().getName())
                        .thenComparing(hit -> hit.organisation().getId()))
                .map(hit -> SearchResult.from(hit.organisation(), hit.score()))
                .toList();
    }

    // The matching contact persons, best first. Equal scores go by name; the id keeps the order stable.
    static List<SearchResult> rankContactPersons(List<ContactPerson> contactPersons,
            Map<String, Organisation> organisationsById, List<String> tokens) {
        record Hit(ContactPerson contactPerson, double score) {
        }
        return contactPersons.stream()
                .map(contactPerson -> new Hit(contactPerson,
                        SearchMatcher.score(tokens, contactPersonFields(contactPerson))))
                .filter(hit -> hit.score() > 0)
                .sorted(Comparator.comparingDouble(Hit::score).reversed()
                        .thenComparing(hit -> hit.contactPerson().getName())
                        .thenComparing(hit -> hit.contactPerson().getId()))
                .map(hit -> SearchResult.from(hit.contactPerson(),
                        organisationsById.get(hit.contactPerson().getOrganisationId()), hit.score()))
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

    private static List<Field> organisationFields(Organisation organisation) {
        String name = organisation.getName();
        return List.of(
                Field.name(name, 5),
                // Search keeps dots and underscores inside words, so without them "coolblue bv" finds "Coolblue B.V.".
                Field.name(name.replace('.', ' ').replace('_', ' '), 5),
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
}
