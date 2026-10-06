package nl.hackyourfuture.dojoserver.volunteer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VolunteerRepository extends JpaRepository<Volunteer, String> {
    boolean existsByEmailIgnoreCase(String email);
}
