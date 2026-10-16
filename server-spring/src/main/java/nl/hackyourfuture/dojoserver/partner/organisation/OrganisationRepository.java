package nl.hackyourfuture.dojoserver.partner.organisation;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrganisationRepository extends JpaRepository<Organisation, String> {
    // The list and the profile show the city, so it is joined in. The plain findAll() of the search doesn't read it.
    @Override
    @EntityGraph(attributePaths = "city")
    Page<Organisation> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "city")
    Optional<Organisation> findById(String id);

    // An array can't have a foreign key, so a deleted user is taken out by hand.
    @Modifying
    @Query(value = """
            update organisations
            set responsible_ids = array_remove(responsible_ids, :userId)
            where :userId = any(responsible_ids)
            """, nativeQuery = true)
    void removeResponsible(String userId);
}
