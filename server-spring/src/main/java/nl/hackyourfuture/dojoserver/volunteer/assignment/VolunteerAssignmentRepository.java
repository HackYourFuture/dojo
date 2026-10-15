package nl.hackyourfuture.dojoserver.volunteer.assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VolunteerAssignmentRepository extends JpaRepository<VolunteerAssignment, String> {
    List<VolunteerAssignment> findByVolunteerIdOrderByStartDateDesc(String volunteerId);

    Optional<VolunteerAssignment> findByIdAndVolunteerId(String id, String volunteerId);
}
