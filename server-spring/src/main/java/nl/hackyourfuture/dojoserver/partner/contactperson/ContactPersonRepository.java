package nl.hackyourfuture.dojoserver.partner.contactperson;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ContactPersonRepository extends JpaRepository<ContactPerson, String> {
    List<ContactPerson> findByOrganisationId(String organisationId, Sort sort);

    Optional<ContactPerson> findByIdAndOrganisationId(String id, String organisationId);
}
