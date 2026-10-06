package nl.hackyourfuture.dojoserver.volunteer;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.authentication.AuthenticatedUser;
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.picture.PictureService;
import nl.hackyourfuture.dojoserver.shared.JsonMergePatch;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoConflictException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.slack.FieldChange;
import nl.hackyourfuture.dojoserver.slack.SlackNotificationSender;
import nl.hackyourfuture.dojoserver.volunteer.dto.VolunteerPictureResponse;
import nl.hackyourfuture.dojoserver.volunteer.dto.VolunteerRequest;
import nl.hackyourfuture.dojoserver.volunteer.dto.VolunteerResponse;
import nl.hackyourfuture.dojoserver.volunteer.dto.VolunteerSummaryResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.node.ObjectNode;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class VolunteerService {
    private final VolunteerRepository volunteerRepository;
    private final JsonMergePatch jsonMergePatch;
    private final Validator validator;
    private final SlackNotificationSender slackNotificationSender;
    private final PictureService pictureService;

    @Transactional(readOnly = true)
    public Page<VolunteerSummaryResponse> getVolunteers(Sort.Direction direction, int page, int size) {
        Sort sort = Sort.by(Sort.Order.by("firstName").with(direction).ignoreCase(),
                Sort.Order.asc("lastName").ignoreCase(), Sort.Order.asc("id"));
        return volunteerRepository.findAll(PageRequest.of(page, size, sort)).map(VolunteerSummaryResponse::from);
    }

    @Transactional(readOnly = true)
    public VolunteerResponse getVolunteer(String id) {
        return VolunteerResponse.from(findVolunteer(id));
    }

    @Transactional
    public VolunteerResponse createVolunteer(AuthenticatedUser currentUser, VolunteerRequest request) {
        if (volunteerRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DojoConflictException("Email is already in use by another volunteer.");
        }

        var newVolunteer = Volunteer.builder()
                .id(RandomUtils.generateRandomId())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .gender(request.gender())
                .pronouns(request.pronouns())
                .companyName(request.companyName())
                .jobRole(request.jobRole())
                .email(request.email())
                .phone(request.phone())
                .githubHandle(request.githubHandle())
                .slackId(request.slackId())
                .linkedinUrl(request.linkedinUrl())
                .status(request.status())
                .notes(request.notes())
                .build();

        Volunteer created = volunteerRepository.save(newVolunteer);
        slackNotificationSender.volunteerCreated(currentUser.name(), created);
        return VolunteerResponse.from(created);
    }

    // Partial update: the sent fields overlay the stored volunteer, and the merged whole is validated.
    @Transactional
    public VolunteerResponse updateVolunteer(AuthenticatedUser currentUser, String id, ObjectNode patch) {
        Volunteer volunteer = findVolunteer(id);
        VolunteerRequest current = VolunteerRequest.from(volunteer);
        VolunteerRequest merged = jsonMergePatch.apply(current, patch);

        // Manually run validation on the merged data because we use `ObjectNode` in the body.
        Set<ConstraintViolation<VolunteerRequest>> violations = validator.validate(merged);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        // Changed email - check for duplicates. A plain rename would otherwise conflict with itself.
        String newEmail = merged.email();
        boolean emailChanged = !volunteer.getEmail().equalsIgnoreCase(newEmail);
        if (emailChanged && volunteerRepository.existsByEmailIgnoreCase(newEmail)) {
            throw new DojoConflictException("Email is already in use by another volunteer.");
        }

        volunteer.setFirstName(merged.firstName());
        volunteer.setLastName(merged.lastName());
        volunteer.setGender(merged.gender());
        volunteer.setPronouns(merged.pronouns());
        volunteer.setCompanyName(merged.companyName());
        volunteer.setJobRole(merged.jobRole());
        volunteer.setEmail(newEmail);
        volunteer.setPhone(merged.phone());
        volunteer.setGithubHandle(merged.githubHandle());
        volunteer.setSlackId(merged.slackId());
        volunteer.setLinkedinUrl(merged.linkedinUrl());
        volunteer.setStatus(merged.status());
        volunteer.setNotes(merged.notes());

        slackNotificationSender.volunteerUpdated(currentUser.name(), volunteer, FieldChange.between(current, merged));
        return VolunteerResponse.from(volunteer);
    }

    @Transactional
    public void deleteVolunteer(AuthenticatedUser currentUser, String id) {
        Volunteer volunteer = findVolunteer(id);
        volunteerRepository.delete(volunteer);
        // Flush before touching storage, so a delete the database refuses keeps the pictures.
        volunteerRepository.flush();
        pictureService.deleteAll(volunteer);
        slackNotificationSender.volunteerDeleted(currentUser.name(), volunteer);
    }

    @Transactional(readOnly = true)
    public StoredFile getPicture(String volunteerId, String pictureId) {
        return pictureService.download(findVolunteer(volunteerId), pictureId);
    }

    @Transactional(readOnly = true)
    public StoredFile getThumbnail(String volunteerId, String pictureId) {
        return pictureService.downloadThumbnail(findVolunteer(volunteerId), pictureId);
    }

    @Transactional
    public VolunteerPictureResponse setPicture(String volunteerId, MultipartFile file) {
        Volunteer volunteer = findVolunteer(volunteerId);
        pictureService.save(volunteer, file);
        return VolunteerPictureResponse.from(volunteer);
    }

    @Transactional
    public void deletePicture(String volunteerId, String pictureId) {
        pictureService.delete(findVolunteer(volunteerId), pictureId);
    }

    private Volunteer findVolunteer(String id) {
        return volunteerRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Volunteer", id));
    }
}
