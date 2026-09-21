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

import java.util.List;

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
