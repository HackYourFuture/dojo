package nl.hackyourfuture.dojoserver.partner.contactperson;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.partner.contactperson.dto.ContactPersonRequest;
import nl.hackyourfuture.dojoserver.partner.contactperson.dto.ContactPersonResponse;
import nl.hackyourfuture.dojoserver.partner.organisation.OrganisationRepository;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactPersonService {
    private final ContactPersonRepository contactPersonRepository;
    private final OrganisationRepository organisationRepository;

    @Transactional(readOnly = true)
    public List<ContactPersonResponse> getContactPersons(String organisationId) {
        requireOrganisation(organisationId);
        Sort sort = Sort.by(Sort.Order.by("name").ignoreCase()).and(Sort.by("id"));
        return contactPersonRepository.findByOrganisationId(organisationId, sort).stream()
                .map(ContactPersonResponse::from)
                .toList();
    }

    @Transactional
    public ContactPersonResponse createContactPerson(String organisationId, ContactPersonRequest request) {
        requireOrganisation(organisationId);

        var newContactPerson = ContactPerson.builder()
                .id(RandomUtils.generateRandomId())
                .organisationId(organisationId)
                .name(request.name())
                .email(request.email())
                .phone(request.phone())
                .linkedinUrl(request.linkedinUrl())
                .jobTitle(request.jobTitle())
                .notes(request.notes())
                .build();

        return ContactPersonResponse.from(contactPersonRepository.save(newContactPerson));
    }

    @Transactional
    public ContactPersonResponse updateContactPerson(String organisationId, String id, ContactPersonRequest request) {
        ContactPerson contactPerson = findContactPerson(organisationId, id);

        contactPerson.setName(request.name());
        contactPerson.setEmail(request.email());
        contactPerson.setPhone(request.phone());
        contactPerson.setLinkedinUrl(request.linkedinUrl());
        contactPerson.setJobTitle(request.jobTitle());
        contactPerson.setNotes(request.notes());

        return ContactPersonResponse.from(contactPerson);
    }

    @Transactional
    public void deleteContactPerson(String organisationId, String id) {
        contactPersonRepository.delete(findContactPerson(organisationId, id));
    }

    /** Every endpoint here is nested under an organisation, so an unknown organisation id is a 404 of its own. */
    private void requireOrganisation(String organisationId) {
        if (!organisationRepository.existsById(organisationId)) {
            throw new DojoNotFoundException("Organisation", organisationId);
        }
    }

    private ContactPerson findContactPerson(String organisationId, String id) {
        requireOrganisation(organisationId);
        return contactPersonRepository.findByIdAndOrganisationId(id, organisationId)
                .orElseThrow(() -> new DojoNotFoundException("Contact person", id));
    }
}
