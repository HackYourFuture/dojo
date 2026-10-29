package nl.hackyourfuture.dojoserver.trainee.profile;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.authentication.AuthenticatedUser;
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.geo.GeoService;
import nl.hackyourfuture.dojoserver.picture.PictureService;
import nl.hackyourfuture.dojoserver.search.SearchService;
import nl.hackyourfuture.dojoserver.shared.JsonMergePatch;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoConflictException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.slack.FieldChange;
import nl.hackyourfuture.dojoserver.slack.SlackNotificationSender;
import nl.hackyourfuture.dojoserver.trainee.assessment.AssessmentService;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeCsv;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineePictureResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeRequest;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.PredicateSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.node.ObjectNode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class TraineeService {
    private final TraineeRepository traineeRepository;
    private final AssessmentService assessmentService;
    private final JsonMergePatch jsonMergePatch;
    private final Validator validator;
    private final SlackNotificationSender slackNotificationSender;
    private final PictureService pictureService;
    private final GeoService geoService;

    @Transactional(readOnly = true)
    public Page<TraineeSummaryResponse> getTrainees(String query, List<LearningStatus> statuses,
            List<JobPath> jobPaths, List<String> provinces, Integer startCohort, Integer endCohort,
            Sort.Direction direction, int page, int size) {
        Page<Trainee> trainees = traineeRepository.findAll(
                filter(query, statuses, jobPaths, provinces, startCohort, endCohort),
                PageRequest.of(page, size, sort(direction)));

        Map<String, BigDecimal> averageScores = assessmentService.getAverageScores(
                trainees.getContent().stream().map(Trainee::getId).toList());

        return trainees.map(trainee -> TraineeSummaryResponse.from(trainee, averageScores.get(trainee.getId())));
    }

    // Every trainee the filters match as CSV, in the list's order. Built here, where the lazy city can be read.
    @Transactional(readOnly = true)
    public String exportTrainees(String query, List<LearningStatus> statuses, List<JobPath> jobPaths,
            List<String> provinces, Integer startCohort, Integer endCohort, Sort.Direction direction) {
        List<Trainee> trainees = traineeRepository.findAll(
                filter(query, statuses, jobPaths, provinces, startCohort, endCohort),
                Pageable.unpaged(sort(direction))).getContent();
        Map<String, BigDecimal> averageScores = assessmentService.getAverageScores(
                trainees.stream().map(Trainee::getId).toList());
        return TraineeCsv.of(trainees, averageScores);
    }

    @Transactional(readOnly = true)
    public TraineeResponse getTrainee(String id) {
        Trainee trainee = findTrainee(id);
        return TraineeResponse.from(trainee);
    }

    @Transactional
    public TraineeResponse createTrainee(AuthenticatedUser currentUser, TraineeRequest request) {
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
                .city(geoService.getCity(request.cityId()))
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
                .certificateId(request.certificateId())
                .jobPath(request.jobPath())
                .jobSupportEndDate(request.jobSupportEndDate())
                .hasCar(request.hasCar())
                .build();

        Trainee created = traineeRepository.save(newTrainee);
        slackNotificationSender.traineeCreated(currentUser.name(), created);
        return TraineeResponse.from(created);
    }

    // Partial update: the sent fields overlay the stored trainee, and the merged whole is validated.
    @Transactional
    public TraineeResponse updateTrainee(AuthenticatedUser currentUser, String id, ObjectNode patch) {
        Trainee trainee = findTrainee(id);
        TraineeRequest current = TraineeRequest.from(trainee);
        TraineeRequest merged = jsonMergePatch.apply(current, patch);

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
        trainee.setCity(geoService.getCity(merged.cityId()));
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
        trainee.setCertificateId(merged.certificateId());
        trainee.setJobPath(merged.jobPath());
        trainee.setJobSupportEndDate(merged.jobSupportEndDate());
        trainee.setHasCar(merged.hasCar());

        slackNotificationSender.traineeUpdated(currentUser.name(), trainee, FieldChange.between(current, merged));
        return TraineeResponse.from(trainee);
    }

    @Transactional
    public void deleteTrainee(AuthenticatedUser currentUser, String id) {
        Trainee trainee = findTrainee(id);
        traineeRepository.delete(trainee);
        // Flush before touching storage, so a delete the database refuses keeps the pictures.
        traineeRepository.flush();
        pictureService.deleteAll(trainee);
        slackNotificationSender.traineeDeleted(currentUser.name(), trainee);
    }

    @Transactional(readOnly = true)
    public StoredFile getPicture(String traineeId, String pictureId) {
        Trainee trainee = findTrainee(traineeId);
        return pictureService.download(trainee, pictureId);
    }

    @Transactional(readOnly = true)
    public StoredFile getThumbnail(String traineeId, String pictureId) {
        Trainee trainee = findTrainee(traineeId);
        return pictureService.downloadThumbnail(trainee, pictureId);
    }

    @Transactional
    public TraineePictureResponse setPicture(String traineeId, MultipartFile file) {
        Trainee trainee = findTrainee(traineeId);
        pictureService.save(trainee, file);
        return TraineePictureResponse.from(trainee);
    }

    @Transactional
    public void deletePicture(String traineeId, String pictureId) {
        Trainee trainee = findTrainee(traineeId);
        pictureService.delete(trainee, pictureId);
    }

    private Trainee findTrainee(String id) {
        return traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
    }

    // The list's filters, each only when given; a trainee must match every one of them.
    private Specification<Trainee> filter(String query, List<LearningStatus> statuses, List<JobPath> jobPaths,
            List<String> provinces, Integer startCohort, Integer endCohort) {
        List<PredicateSpecification<Trainee>> filters = new ArrayList<>();
        if (query != null && !query.isBlank()) {
            // The search's close spellings can't be queried, so the matching ids come from Java.
            List<String> ids = traineeRepository.findAll().stream()
                    .filter(trainee -> SearchService.matches(trainee, query))
                    .map(Trainee::getId)
                    .toList();
            filters.add(TraineeSpecifications.idIn(ids));
        }
        if (!CollectionUtils.isEmpty(statuses)) {
            filters.add(TraineeSpecifications.learningStatusIn(statuses));
        }
        if (!CollectionUtils.isEmpty(jobPaths)) {
            filters.add(TraineeSpecifications.jobPathIn(jobPaths));
        }
        if (!CollectionUtils.isEmpty(provinces)) {
            filters.add(TraineeSpecifications.provinceIn(provinces));
        }
        if (startCohort != null) {
            filters.add(TraineeSpecifications.currentCohortFrom(startCohort));
        }
        if (endCohort != null) {
            filters.add(TraineeSpecifications.currentCohortTo(endCohort));
        }
        return Specification.where(PredicateSpecification.allOf(filters));
    }

    // Trainees with no cohort come first either way.
    private static Sort sort(Sort.Direction direction) {
        return Sort.by(Sort.Order.by("currentCohort").with(direction).nullsFirst(),
                Sort.Order.asc("lastName").ignoreCase(), Sort.Order.asc("id"));
    }
}
