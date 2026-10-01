package nl.hackyourfuture.dojoserver.partner.organisation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.authentication.AuthenticatedUser;
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationPictureResponse;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationRequest;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationResponse;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationSummaryResponse;
import nl.hackyourfuture.dojoserver.picture.PictureService;
import nl.hackyourfuture.dojoserver.shared.JsonMergePatch;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.slack.SlackNotificationSender;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import tools.jackson.databind.node.ObjectNode;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganisationService {
    private final OrganisationRepository organisationRepository;
    private final UserRepository userRepository;
    private final JsonMergePatch jsonMergePatch;
    private final Validator validator;
    private final PictureService pictureService;
    private final SlackNotificationSender slackNotificationSender;

    @Transactional(readOnly = true)
    public Page<OrganisationSummaryResponse> getOrganisations(Sort.Direction direction, int page, int size) {
        Sort sort = Sort.by(Sort.Order.by("name").with(direction).ignoreCase()).and(Sort.by("id"));
        Page<Organisation> organisations = organisationRepository.findAll(PageRequest.of(page, size, sort));
        Map<String, User> users = usersMap();
        return organisations.map(organisation -> OrganisationSummaryResponse.from(organisation, users));
    }

    @Transactional(readOnly = true)
    public OrganisationResponse getOrganisation(String id) {
        var organisation = findOrganisation(id);
        return OrganisationResponse.from(organisation, usersMap());
    }

    @Transactional
    public OrganisationResponse createOrganisation(AuthenticatedUser currentUser, OrganisationRequest request) {
        checkResponsibles(request.responsibleIds());
        var newOrganisation = Organisation.builder()
                .id(RandomUtils.generateRandomId())
                .name(request.name())
                .websiteUrl(request.websiteUrl())
                .linkedinUrl(request.linkedinUrl())
                .location(request.location())
                .status(request.status())
                .notes(request.notes())
                .partnershipTypes(request.partnershipTypes())
                .responsibleIds(request.responsibleIds())
                .build();

        Organisation created = organisationRepository.save(newOrganisation);
        slackNotificationSender.organisationCreated(currentUser.name(), created);
        return OrganisationResponse.from(created, usersMap());
    }

    // Partial update: the sent fields overlay the stored organisation, and the merged whole is validated.
    @Transactional
    public OrganisationResponse updateOrganisation(String id, ObjectNode patch) {
        Organisation organisation = findOrganisation(id);
        OrganisationRequest merged = jsonMergePatch.apply(OrganisationRequest.from(organisation), patch);

        // Manually run validation on the merged data because we use `ObjectNode` in the body.
        Set<ConstraintViolation<OrganisationRequest>> violations = validator.validate(merged);
        if (!violations.isEmpty()) {
            throw new ConstraintViolationException(violations);
        }

        // Verify that the responsible are existing UserIDs in the system
        if (!merged.responsibleIds().equals(organisation.getResponsibleIds())) {
            checkResponsibles(merged.responsibleIds());
        }

        organisation.setName(merged.name());
        organisation.setWebsiteUrl(merged.websiteUrl());
        organisation.setLinkedinUrl(merged.linkedinUrl());
        organisation.setLocation(merged.location());
        organisation.setStatus(merged.status());
        organisation.setNotes(merged.notes());
        organisation.setPartnershipTypes(merged.partnershipTypes());
        organisation.setResponsibleIds(merged.responsibleIds());

        return OrganisationResponse.from(organisation, usersMap());
    }

    @Transactional
    public void deleteOrganisation(AuthenticatedUser currentUser, String id) {
        Organisation organisation = findOrganisation(id);
        organisationRepository.delete(organisation);
        // Flush before touching storage, so a delete the database refuses keeps the logo.
        organisationRepository.flush();
        pictureService.deleteAll(organisation);
        slackNotificationSender.organisationDeleted(currentUser.name(), organisation);
    }

    @Transactional(readOnly = true)
    public StoredFile getPicture(String organisationId, String pictureId) {
        return pictureService.download(findOrganisation(organisationId), pictureId);
    }

    @Transactional(readOnly = true)
    public StoredFile getThumbnail(String organisationId, String pictureId) {
        return pictureService.downloadThumbnail(findOrganisation(organisationId), pictureId);
    }

    @Transactional
    public OrganisationPictureResponse setPicture(String organisationId, MultipartFile file) {
        Organisation organisation = findOrganisation(organisationId);
        pictureService.save(organisation, file);
        return OrganisationPictureResponse.from(organisation);
    }

    @Transactional
    public void deletePicture(String organisationId, String pictureId) {
        pictureService.delete(findOrganisation(organisationId), pictureId);
    }

    private Organisation findOrganisation(String id) {
        return organisationRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Organisation", id));
    }

    private Map<String, User> usersMap() {
        return userRepository
                .findAll()
                .stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
    }

    // The ids have no foreign key, so each one is checked to be a user.
    private void checkResponsibles(List<String> ids) {
        for (String id : ids) {
            if (!userRepository.existsById(id)) {
                throw new DojoBadRequestException("The responsible with id '" + id + "' is not a user.");
            }
        }
    }
}
