package nl.hackyourfuture.dojoserver.trainee.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, String> {
    List<Assessment> findByTraineeIdOrderByDateDesc(String traineeId);

    Optional<Assessment> findByIdAndTraineeId(String id, String traineeId);
}
