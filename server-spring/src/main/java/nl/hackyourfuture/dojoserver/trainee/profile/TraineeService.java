package nl.hackyourfuture.dojoserver.trainee.profile;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.JsonMergePatch;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoConflictException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeRequest;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeSummaryResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TraineeService {
    private final TraineeRepository traineeRepository;
    private final JsonMergePatch jsonMergePatch;
    private final Validator validator;

    @Transactional(readOnly = true)
    public List<TraineeSummaryResponse> getAllTrainees() {
        return traineeRepository.findAll().stream().map(TraineeSummaryResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TraineeResponse getTrainee(String id) {
        Trainee trainee = traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
        return TraineeResponse.from(trainee);
    }

    @Transactional
    public TraineeResponse createTrainee(TraineeRequest request) {
        if (traineeRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DojoConflictException("Email is already in use by another trainee.");
        }

        var newTrainee = Trainee.builder()
                .id(RandomUtils.generateRandomId())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .preferredName(request.preferredName())
                .gender(request.gender())
                .pronouns(request.pronouns())
                .dateOfBirth(request.dateOfBirth())
                .location(request.location())
                .englishLevel(request.englishLevel())
                .professionalDutch(request.professionalDutch())
                .countryOfOrigin(request.countryOfOrigin())
                .background(request.background())
                .nlArrivalDate(request.nlArrivalDate())
                .firstPermitIssueDate(request.firstPermitIssueDate())
                .financialSupport(request.financialSupport())
                .educationLevel(request.educationLevel())
                .educationBackground(request.educationBackground())
                .weeklyWorkHours(request.weeklyWorkHours())
                .dietaryPreference(request.dietaryPreference())
                .healthCondition(request.healthCondition())
                .comments(request.comments())
                .esfId(request.esfId())
                .email(request.email())
                .slackId(request.slackId())
                .phone(request.phone())
                .githubHandle(request.githubHandle())
                .linkedinUrl(request.linkedinUrl())
                .emergencyContactName(request.emergencyContactName())
                .emergencyContactRelationship(request.emergencyContactRelationship())
                .emergencyContactPhone(request.emergencyContactPhone())
                .startCohort(request.startCohort())
                .currentCohort(request.currentCohort())
                .track(request.track())
                .learningStatus(request.learningStatus())
                .startDate(request.startDate())
                .graduationDate(request.graduationDate())
                .quitDate(request.quitDate())
                .quitReason(request.quitReason())
                .mentorTech(request.mentorTech())
                .mentorHr(request.mentorHr())
                .mentorEnglish(request.mentorEnglish())
                .jobPath(request.jobPath())
                .jobSupportEndDate(request.jobSupportEndDate())
                .hasCar(request.hasCar())
                .build();

        Trainee created = traineeRepository.save(newTrainee);
        return TraineeResponse.from(created);
    }

    /**
     * Partial update: the fields the caller sent are applied on top of the stored trainee and the
     * result is validated as a whole, so the create rules hold for anything that changed.
     */
    @Transactional
    public TraineeResponse updateTrainee(String id, ObjectNode patch) {
        Trainee trainee = traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
        TraineeRequest merged = jsonMergePatch.apply(TraineeRequest.from(trainee), patch);

        // Manually run validation on the merged data because we use `ObjectNode` in the body.
        Set<ConstraintViolation<TraineeRequest>> violations = validator.validate(merged);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        // Changed email - check for duplicates. A plain rename would otherwise conflict with itself.
        String newEmail = merged.email();
        boolean emailChanged = !trainee.getEmail().equalsIgnoreCase(newEmail);
        if (emailChanged && traineeRepository.existsByEmailIgnoreCase(newEmail)) {
            throw new DojoConflictException("Email is already in use by another trainee.");
        }

        trainee.setEmail(newEmail);
        trainee.setFirstName(merged.firstName());
        trainee.setLastName(merged.lastName());
        trainee.setPreferredName(merged.preferredName());
        trainee.setGender(merged.gender());
        trainee.setPronouns(merged.pronouns());
        trainee.setDateOfBirth(merged.dateOfBirth());
        trainee.setLocation(merged.location());
        trainee.setEnglishLevel(merged.englishLevel());
        trainee.setProfessionalDutch(merged.professionalDutch());
        trainee.setCountryOfOrigin(merged.countryOfOrigin());
        trainee.setBackground(merged.background());
        trainee.setNlArrivalDate(merged.nlArrivalDate());
        trainee.setFirstPermitIssueDate(merged.firstPermitIssueDate());
        trainee.setFinancialSupport(merged.financialSupport());
        trainee.setEducationLevel(merged.educationLevel());
        trainee.setEducationBackground(merged.educationBackground());
        trainee.setWeeklyWorkHours(merged.weeklyWorkHours());
        trainee.setDietaryPreference(merged.dietaryPreference());
        trainee.setHealthCondition(merged.healthCondition());
        trainee.setComments(merged.comments());
        trainee.setEsfId(merged.esfId());
        trainee.setSlackId(merged.slackId());
        trainee.setPhone(merged.phone());
        trainee.setGithubHandle(merged.githubHandle());
        trainee.setLinkedinUrl(merged.linkedinUrl());
        trainee.setEmergencyContactName(merged.emergencyContactName());
        trainee.setEmergencyContactRelationship(merged.emergencyContactRelationship());
        trainee.setEmergencyContactPhone(merged.emergencyContactPhone());
        trainee.setStartCohort(merged.startCohort());
        trainee.setCurrentCohort(merged.currentCohort());
        trainee.setTrack(merged.track());
        trainee.setLearningStatus(merged.learningStatus());
        trainee.setStartDate(merged.startDate());
        trainee.setGraduationDate(merged.graduationDate());
        trainee.setQuitDate(merged.quitDate());
        trainee.setQuitReason(merged.quitReason());
        trainee.setMentorTech(merged.mentorTech());
        trainee.setMentorHr(merged.mentorHr());
        trainee.setMentorEnglish(merged.mentorEnglish());
        trainee.setJobPath(merged.jobPath());
        trainee.setJobSupportEndDate(merged.jobSupportEndDate());
        trainee.setHasCar(merged.hasCar());

        return TraineeResponse.from(trainee);
    }

    @Transactional
    public void deleteTrainee(String id) {
        Trainee trainee = traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
        traineeRepository.delete(trainee);
    }
}
