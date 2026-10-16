package nl.hackyourfuture.dojoserver.volunteer.pairing;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MentorPairingRepository extends JpaRepository<MentorPairing, String> {
    @EntityGraph(attributePaths = "trainee")
    List<MentorPairing> findByVolunteerIdOrderByStartDateDescIdAsc(String volunteerId);

    Optional<MentorPairing> findByIdAndVolunteerId(String id, String volunteerId);
}
