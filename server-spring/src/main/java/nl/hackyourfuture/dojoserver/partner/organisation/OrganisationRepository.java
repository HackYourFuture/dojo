package nl.hackyourfuture.dojoserver.partner.organisation;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganisationRepository extends JpaRepository<Organisation, String> {

    // An array can't have a foreign key, so a deleted user is taken out by hand.
    @Modifying
    @Query(value = """
            update organisations
            set responsible_ids = array_remove(responsible_ids, :userId)
            where :userId = any(responsible_ids)
            """, nativeQuery = true)
    void removeResponsible(String userId);
}
