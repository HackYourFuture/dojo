package nl.hackyourfuture.dojoserver.volunteer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, String>, JpaSpecificationExecutor<Volunteer> {
    boolean existsByEmailIgnoreCase(String email);
}
