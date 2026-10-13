package nl.hackyourfuture.dojoserver.search;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.partner.contactperson.ContactPerson;
import nl.hackyourfuture.dojoserver.partner.contactperson.ContactPersonRepository;
import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;
import nl.hackyourfuture.dojoserver.partner.organisation.OrganisationRepository;
import nl.hackyourfuture.dojoserver.search.dto.SearchResult;
import nl.hackyourfuture.dojoserver.shared.Hit;
import nl.hackyourfuture.dojoserver.shared.SearchText;
import nl.hackyourfuture.dojoserver.shared.TextMatcher;
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

    // A searchable text of a record and how much a match in it counts.
    record Field(String text, double weight) {
    }

    @Transactional(readOnly = true)
    public List<SearchResult> search(String query) {
        if (SearchText.isTooShort(query)) {
            return List.of();
        }
        // Every record is scored: close spellings mean no database index can narrow the candidates.
        return rank(
                traineeRepository.findAll(),
                volunteerRepository.findAll(),
                organisationRepository.findAll(),
                contactPersonRepository.findAll(),
                query
        ).stream().limit(MAX_RESULTS).toList();
    }

    // Every matching record, best first. The sort is stable, so equal scores put trainees first, then volunteers,
    // then organisations, then contact persons, each in its own order.
    static List<SearchResult> rank(List<Trainee> trainees, List<Volunteer> volunteers,
            List<Organisation> organisations, List<ContactPerson> contactPersons, String query) {
        Map<String, Organisation> organisationsById = organisations.stream()
                .collect(Collectors.toMap(Organisation::getId, Function.identity()));
        return Stream.of(
                rankTrainees(trainees, query),
                rankVolunteers(volunteers, query),
                rankOrganisations(organisations, query),
                rankContactPersons(contactPersons, organisationsById, query))
                .flatMap(List::stream)
                .sorted(Comparator.comparingDouble(SearchResult::score).reversed())
                .toList();
    }

    // The matching trainees, best first. Equal scores go by newest cohort, then name; the id keeps the order stable.
    static List<SearchResult> rankTrainees(List<Trainee> trainees, String query) {
        Comparator<Trainee> ties = Comparator
                .comparing(Trainee::getCurrentCohort, Comparator.nullsLast(Comparator.reverseOrder()))
                .thenComparing(Trainee::getDisplayName)
                .thenComparing(Trainee::getId);
        return Hit.rank(trainees, trainee -> score(traineeFields(trainee), query), ties).stream()
                .map(hit -> SearchResult.from(hit.item(), hit.score()))
                .toList();
    }

    // The matching volunteers, best first. Equal scores go by name; the id keeps the order stable.
    static List<SearchResult> rankVolunteers(List<Volunteer> volunteers, String query) {
        Comparator<Volunteer> ties = Comparator.comparing(Volunteer::getDisplayName).thenComparing(Volunteer::getId);
        return Hit.rank(volunteers, volunteer -> score(volunteerFields(volunteer), query), ties).stream()
                .map(hit -> SearchResult.from(hit.item(), hit.score()))
                .toList();
    }

    // The matching organisations, best first. Equal scores go by name; the id keeps the order stable.
    static List<SearchResult> rankOrganisations(List<Organisation> organisations, String query) {
        Comparator<Organisation> ties = Comparator.comparing(Organisation::getName)
                .thenComparing(Organisation::getId);
        return Hit.rank(organisations, organisation -> score(organisationFields(organisation), query), ties).stream()
                .map(hit -> SearchResult.from(hit.item(), hit.score()))
                .toList();
    }

    // The matching contact persons, best first. Equal scores go by name; the id keeps the order stable.
    static List<SearchResult> rankContactPersons(List<ContactPerson> contactPersons,
            Map<String, Organisation> organisationsById, String query) {
        Comparator<ContactPerson> ties = Comparator.comparing(ContactPerson::getName)
                .thenComparing(ContactPerson::getId);
        return Hit.rank(contactPersons, contactPerson -> score(contactPersonFields(contactPerson,
                organisationsById.get(contactPerson.getOrganisationId())), query), ties).stream()
                .map(hit -> SearchResult.from(hit.item(), organisationsById.get(hit.item().getOrganisationId()),
                        hit.score()))
                .toList();
    }

    // Every word of the query at its best field, weight times match, added up, or the whole query in one field,
    // counting for all its words: "mariam haddad" finds a first and a last name, "abdul rahman" an Abdulrahman.
    static double score(List<Field> fields, String query) {
        List<String> words = SearchText.words(query);
        // One word is matched as typed: the dot in "@adyen.com" would split once the @ is trimmed off.
        if (words.size() == 1) {
            return bestField(fields, query);
        }
        return Math.max(scoreEachWord(fields, words), words.size() * bestField(fields, query));
    }

    // 0 when a word matches nowhere.
    private static double scoreEachWord(List<Field> fields, List<String> words) {
        double total = 0;
        for (String word : words) {
            double best = bestField(fields, word);
            if (best == 0) {
                return 0;
            }
            total += best;
        }
        return total;
    }

    private static double bestField(List<Field> fields, String query) {
        return fields.stream()
                .mapToDouble(field -> field.weight() * TextMatcher.score(field.text(), query))
                .max()
                .orElse(0);
    }

    // The fields staff search trainees by, the most used first.
    private static List<Field> traineeFields(Trainee trainee) {
        return List.of(
                new Field(trainee.getCalledName(), 5),
                // The full name too: "abdulrahman" finds Abdul Rahman, and "abdul rahman" counts as his whole name.
                new Field(trainee.getDisplayName(), 5),
                new Field(trainee.getFirstName(), 4),
                new Field(trainee.getLastName(), 3),
                new Field(trainee.getEmail(), 2),
                new Field(trainee.getGithubHandle(), 1),
                // Far below the other weights on purpose: a mention in the notes ranks below a match elsewhere.
                new Field(trainee.getComments(), 0.001));
    }

    // The first name weighs 5, like a trainee's called name, so ties fall to the merge order.
    private static List<Field> volunteerFields(Volunteer volunteer) {
        return List.of(
                new Field(volunteer.getFirstName(), 5),
                new Field(volunteer.getDisplayName(), 5),
                new Field(volunteer.getLastName(), 3),
                new Field(volunteer.getEmail(), 2),
                new Field(volunteer.getGithubHandle(), 1),
                new Field(volunteer.getCompanyName(), 1),
                new Field(volunteer.getJobRole(), 1),
                new Field(volunteer.getNotes(), 0.001));
    }

    private static List<Field> organisationFields(Organisation organisation) {
        return List.of(
                new Field(organisation.getName(), 5),
                new Field(organisation.getWebsiteUrl(), 3),
                new Field(organisation.getNotes(), 0.001));
    }

    // The name weighs 3, like a trainee's last name, so a contact person never outranks a trainee of the same name.
    // Each word of it counts on its own too, like a first and a last name, and the organisation's name finds them by
    // "jane acme".
    private static List<Field> contactPersonFields(ContactPerson contactPerson, Organisation organisation) {
        Stream<Field> nameWords = SearchText.words(contactPerson.getName()).stream().map(word -> new Field(word, 3));
        return Stream.concat(nameWords, Stream.of(
                new Field(contactPerson.getName(), 3),
                new Field(contactPerson.getEmail(), 2),
                new Field(contactPerson.getJobTitle(), 1),
                new Field(organisation.getName(), 1),
                new Field(contactPerson.getNotes(), 0.001))).toList();
    }
}
