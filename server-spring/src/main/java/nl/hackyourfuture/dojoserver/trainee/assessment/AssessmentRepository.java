package nl.hackyourfuture.dojoserver.trainee.assessment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface AssessmentRepository extends JpaRepository<Assessment, String> {
    List<Assessment> findByTraineeIdOrderByDateDesc(String traineeId);

    Optional<Assessment> findByIdAndTraineeId(String id, String traineeId);

    // One row per trainee and type: grouping on the type is what keeps a retake from counting twice.
    @Query("""
            select traineeId, max(score)
            from Assessment
            where traineeId in :traineeIds and score is not null
            group by traineeId, type
            """)
    List<BestScore> findBestScorePerType(Collection<String> traineeIds);
}
