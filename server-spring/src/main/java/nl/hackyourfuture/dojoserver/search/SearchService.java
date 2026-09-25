package nl.hackyourfuture.dojoserver.search;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.search.SearchMatcher.Field;
import nl.hackyourfuture.dojoserver.search.dto.SearchResult;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {
    private static final int MAX_RESULTS = 20;

    private final TraineeRepository traineeRepository;

    @Transactional(readOnly = true)
    public List<SearchResult> search(String query) {
        List<String> tokens = SearchMatcher.tokenize(query);
        if (tokens.isEmpty()) {
            return List.of();
        }
        // Every trainee is scored: close spellings mean no database index can narrow the candidates.
        return rankTrainees(traineeRepository.findAll(), tokens).stream().limit(MAX_RESULTS).toList();
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
}
