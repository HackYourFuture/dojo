package nl.hackyourfuture.dojoserver.partner.organisation;

import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import jakarta.validation.Validator;
import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.authentication.AuthenticatedUser;
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.geo.GeoService;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationCsv;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationPictureResponse;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationRequest;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationResponse;
import nl.hackyourfuture.dojoserver.partner.organisation.dto.OrganisationSummaryResponse;
import nl.hackyourfuture.dojoserver.picture.PictureService;
import nl.hackyourfuture.dojoserver.search.SearchService;
import nl.hackyourfuture.dojoserver.shared.JsonMergePatch;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.slack.SlackNotificationSender;
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

import java.util.ArrayList;
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
    private final GeoService geoService;

    @Transactional(readOnly = true)
    public Page<OrganisationSummaryResponse> getOrganisations(String query, List<OrganisationStatus> statuses,
            List<String> responsibleIds, List<PartnershipType> partnershipTypes, List<String> provinces,
            Sort.Direction direction, int page, int size) {
        Page<Organisation> organisations = organisationRepository.findAll(
                filter(query, statuses, responsibleIds, partnershipTypes, provinces),
                PageRequest.of(page, size, sort(direction)));
        Map<String, User> users = usersMap();
        return organisations.map(organisation -> OrganisationSummaryResponse.from(organisation, users));
    }

    // Every organisation the filters match as CSV, in the list's order. Built here, where the lazy city can be read.
    @Transactional(readOnly = true)
    public String exportOrganisations(String query, List<OrganisationStatus> statuses, List<String> responsibleIds,
            List<PartnershipType> partnershipTypes, List<String> provinces, Sort.Direction direction) {
        List<Organisation> organisations = organisationRepository.findAll(
                filter(query, statuses, responsibleIds, partnershipTypes, provinces),
                Pageable.unpaged(sort(direction))).getContent();
        return OrganisationCsv.of(organisations, usersMap());
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
                .city(geoService.getCity(request.cityId()))
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
        organisation.setCity(geoService.getCity(merged.cityId()));
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

    // The list's filters, each only when given; an organisation must match every one of them.
    private Specification<Organisation> filter(String query, List<OrganisationStatus> statuses,
            List<String> responsibleIds, List<PartnershipType> partnershipTypes, List<String> provinces) {
        List<PredicateSpecification<Organisation>> filters = new ArrayList<>();
        if (query != null && !query.isBlank()) {
            // The search's close spellings can't be queried, so the matching ids come from Java.
            List<String> ids = organisationRepository.findAll().stream()
                    .filter(organisation -> SearchService.matches(organisation, query))
                    .map(Organisation::getId)
                    .toList();
            filters.add(OrganisationSpecifications.idIn(ids));
        }
        if (!CollectionUtils.isEmpty(statuses)) {
            filters.add(OrganisationSpecifications.statusIn(statuses));
        }
        if (!CollectionUtils.isEmpty(responsibleIds)) {
            filters.add(OrganisationSpecifications.responsibleIdIn(responsibleIds));
        }
        if (!CollectionUtils.isEmpty(partnershipTypes)) {
            filters.add(OrganisationSpecifications.partnershipTypeIn(partnershipTypes));
        }
        if (!CollectionUtils.isEmpty(provinces)) {
            filters.add(OrganisationSpecifications.provinceIn(provinces));
        }
        return Specification.where(PredicateSpecification.allOf(filters));
    }

    private static Sort sort(Sort.Direction direction) {
        return Sort.by(Sort.Order.by("name").with(direction).ignoreCase()).and(Sort.by("id"));
    }
}
