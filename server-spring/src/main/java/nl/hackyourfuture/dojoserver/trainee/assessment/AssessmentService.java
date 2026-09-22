package nl.hackyourfuture.dojoserver.trainee.assessment;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.authentication.AuthenticatedUser;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.slack.SlackNotificationSender;
import nl.hackyourfuture.dojoserver.trainee.assessment.dto.AssessmentRequest;
import nl.hackyourfuture.dojoserver.trainee.assessment.dto.AssessmentResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssessmentService {
    private final AssessmentRepository assessmentRepository;
    private final TraineeRepository traineeRepository;
    private final SlackNotificationSender slackNotificationSender;

    @Transactional(readOnly = true)
    public List<AssessmentResponse> getAssessments(String traineeId) {
        requireTrainee(traineeId);
        return assessmentRepository.findByTraineeIdOrderByDateDesc(traineeId).stream()
                .map(AssessmentResponse::from)
                .toList();
    }

    /** Average score per trainee, for the ids given. A trainee with no scored assessment is absent from the map. */
    @Transactional(readOnly = true)
    public Map<String, BigDecimal> getAverageScores(Collection<String> traineeIds) {
        if (traineeIds.isEmpty()) {
            return Map.of();
        }

        Map<String, List<BigDecimal>> bestPerType = assessmentRepository.findBestScorePerType(traineeIds).stream()
                .collect(Collectors.groupingBy(BestScore::traineeId,
                        Collectors.mapping(BestScore::bestScore, Collectors.toList())));

        return bestPerType.entrySet().stream()
                .collect(Collectors.toMap(Map.Entry::getKey, entry -> average(entry.getValue())));
    }

    @Transactional
    public AssessmentResponse createAssessment(AuthenticatedUser currentUser, String traineeId,
            AssessmentRequest request) {
        Trainee trainee = requireTrainee(traineeId);

        var newAssessment = Assessment.builder()
                .id(RandomUtils.generateRandomId())
                .traineeId(traineeId)
                .date(request.date())
                .type(request.type())
                .result(request.result())
                .score(request.score())
                .comments(request.comments())
                .build();

        Assessment created = assessmentRepository.save(newAssessment);
        slackNotificationSender.traineeAssessmentCreated(currentUser.name(), trainee, created);
        return AssessmentResponse.from(created);
    }

    @Transactional
    public AssessmentResponse updateAssessment(String traineeId, String id, AssessmentRequest request) {
        Assessment assessment = findAssessment(traineeId, id);

        assessment.setDate(request.date());
        assessment.setType(request.type());
        assessment.setResult(request.result());
        assessment.setScore(request.score());
        assessment.setComments(request.comments());

        return AssessmentResponse.from(assessment);
    }

    @Transactional
    public void deleteAssessment(String traineeId, String id) {
        assessmentRepository.delete(findAssessment(traineeId, id));
    }

    // The mean of the best score per assessment type. Two decimals, the client rounds to one for display.
    private static BigDecimal average(List<BigDecimal> scores) {
        BigDecimal sum = scores.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        return sum.divide(BigDecimal.valueOf(scores.size()), 2, RoundingMode.HALF_UP);
    }

    /** Every endpoint here is nested under a trainee, so an unknown trainee id is a 404 of its own. */
    private Trainee requireTrainee(String traineeId) {
        return traineeRepository.findById(traineeId)
                .orElseThrow(() -> new DojoNotFoundException("Trainee", traineeId));
    }

    private Assessment findAssessment(String traineeId, String id) {
        requireTrainee(traineeId);
        return assessmentRepository.findByIdAndTraineeId(id, traineeId)
                .orElseThrow(() -> new DojoNotFoundException("Assessment", id));
    }
}
