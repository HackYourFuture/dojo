package nl.hackyourfuture.dojoserver.trainee.profile;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.hackyourfuture.dojoserver.authentication.AuthenticatedUser;
import nl.hackyourfuture.dojoserver.filestorage.FileStorageService;
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.shared.JsonMergePatch;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoConflictException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.slack.FieldChange;
import nl.hackyourfuture.dojoserver.slack.SlackNotificationSender;
import nl.hackyourfuture.dojoserver.trainee.assessment.AssessmentService;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineePictureResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeRequest;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.PredicateSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.io.InputStream;
import java.lang.reflect.RecordComponent;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
public class TraineeService {
    // Pictures are served back as uploaded, so only types a browser renders as an image.
    private static final Set<String> PICTURE_CONTENT_TYPES = Set.of("image/jpeg", "image/png", "image/webp");

    private final TraineeRepository traineeRepository;
    private final AssessmentService assessmentService;
    private final JsonMergePatch jsonMergePatch;
    private final Validator validator;
    private final SlackNotificationSender slackNotificationSender;
    private final FileStorageService fileStorageService;

    @Transactional(readOnly = true)
    public Page<TraineeSummaryResponse> getTrainees(Integer startCohort, Integer endCohort,
            Sort.Direction direction, int page, int size) {
        List<PredicateSpecification<Trainee>> filters = new ArrayList<>();
        if (startCohort != null) {
            filters.add(TraineeSpecifications.currentCohortFrom(startCohort));
        }
        if (endCohort != null) {
            filters.add(TraineeSpecifications.currentCohortTo(endCohort));
        }

        // Trainees with no cohort come first either way.
        Sort sort = Sort.by(Sort.Order.by("currentCohort").with(direction).nullsFirst())
                .and(Sort.by("lastName", "id"));

        Page<Trainee> trainees = traineeRepository.findAll(
                Specification.where(PredicateSpecification.allOf(filters)),
                PageRequest.of(page, size, sort));

        Map<String, BigDecimal> averageScores = assessmentService.getAverageScores(
                trainees.getContent().stream().map(Trainee::getId).toList());

        return trainees.map(trainee -> TraineeSummaryResponse.from(trainee, averageScores.get(trainee.getId())));
    }

    @Transactional(readOnly = true)
    public TraineeResponse getTrainee(String id) {
        Trainee trainee = traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
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
        slackNotificationSender.traineeCreated(currentUser.name(), created);
        return TraineeResponse.from(created);
    }

    /**
     * Partial update: the fields the caller sent are applied on top of the stored trainee and the
     * result is validated as a whole, so the create rules hold for anything that changed.
     */
    @Transactional
    public TraineeResponse updateTrainee(AuthenticatedUser currentUser, String id, ObjectNode patch) {
        Trainee trainee = traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
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

        slackNotificationSender.traineeUpdated(currentUser.name(), trainee, changes(current, merged));
        return TraineeResponse.from(trainee);
    }

    @Transactional
    public void deleteTrainee(AuthenticatedUser currentUser, String id) {
        Trainee trainee = traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
        // Delete all pictures
        fileStorageService.deleteAllWithPrefix(trainee.getPictureStoragePrefix());
        traineeRepository.delete(trainee);
        slackNotificationSender.traineeDeleted(currentUser.name(), trainee);
    }

    @Transactional(readOnly = true)
    public StoredFile getPicture(String traineeId, String pictureId) {
        Trainee trainee = findTrainee(traineeId);
        if (!pictureId.strip().equals(trainee.getPictureId())) {
            throw new DojoNotFoundException("Picture", pictureId);
        }
        String key = trainee.getPictureStorageKey(trainee.getPictureId());
        return fileStorageService.download(key);
    }

    @Transactional(readOnly = true)
    public StoredFile getThumbnail(String traineeId, String pictureId) {
        Trainee trainee = findTrainee(traineeId);
        if (!pictureId.strip().equals(trainee.getPictureId())) {
            throw new DojoNotFoundException("Thumbnail", pictureId);
        }
        String key = trainee.getThumbnailStorageKey(trainee.getPictureId());
        return fileStorageService.download(key);
    }

    @Transactional
    public TraineePictureResponse setPicture(String id, MultipartFile file) {
        Trainee trainee = findTrainee(id);
        if (file.isEmpty()) {
            throw new DojoBadRequestException("The picture file is empty.");
        }
        if (file.getContentType() == null || !PICTURE_CONTENT_TYPES.contains(file.getContentType())) {
            throw new DojoBadRequestException("The picture must be a JPEG, PNG or WebP image.");
        }
        String oldPictureId = trainee.getPictureId();
        String newPictureId = "IMG" + RandomUtils.generateRandomId(10);

        String pictureKey = trainee.getPictureStorageKey(newPictureId);
        String thumbnailKey = trainee.getThumbnailStorageKey(newPictureId);
        try (InputStream picture = file.getInputStream(); InputStream thumbnail = file.getInputStream()) {
            fileStorageService.upload(pictureKey, file.getContentType(), picture, file.getSize());
            // TODO: actually make a thumbnail
            fileStorageService.upload(thumbnailKey, file.getContentType(), thumbnail, file.getSize());
        } catch (IOException e) {
            log.error("Trainee id {} - profile picture upload failed: {}", id, e.getMessage());
            throw new RuntimeException(e);
        }

        // Save the new picture id in the database
        trainee.setPictureId(newPictureId);

        // Delete the old picture and thumbnail
        if (oldPictureId != null) {
            cleanUpPictures(trainee, oldPictureId);
        }

        return new TraineePictureResponse(trainee.getPictureUrl(), trainee.getThumbnailUrl());
    }

    @Transactional
    public void deletePicture(String id, String pictureId) {
        Trainee trainee = findTrainee(id);
        if (!pictureId.strip().equals(trainee.getPictureId())) {
            throw new DojoNotFoundException("Picture", pictureId);
        }
        cleanUpPictures(trainee, trainee.getPictureId());
        trainee.setPictureId(null);
    }

    private Trainee findTrainee(String id) {
        return traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
    }

    /**
     * The fields the patch actually changed, for the notification. Read off the record components so a
     * field added to `TraineeRequest` is covered without touching this.
     */
    private static List<FieldChange> changes(TraineeRequest current, TraineeRequest merged) {
        return Arrays.stream(TraineeRequest.class.getRecordComponents())
                .filter(component -> !Objects.equals(read(component, current), read(component, merged)))
                .map(component -> new FieldChange(component.getName(), read(component, current),
                        read(component, merged)))
                .toList();
    }

    private static Object read(RecordComponent component, TraineeRequest request) {
        try {
            return component.getAccessor().invoke(request);
        } catch (ReflectiveOperationException e) {
            throw new IllegalStateException("Cannot read " + component.getName(), e);
        }
    }

    private void cleanUpPictures(Trainee trainee, String pictureId) {
        try {
            String oldPictureKey = trainee.getPictureStorageKey(pictureId);
            String oldThumbnailKey = trainee.getThumbnailStorageKey(pictureId);
            fileStorageService.delete(oldPictureKey);
            fileStorageService.delete(oldThumbnailKey);
        } catch (RuntimeException e) {
            log.error("Error deleting trainee picture: {}", e.getMessage());
        }
    }
}
