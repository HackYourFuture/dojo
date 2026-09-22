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
            select a.traineeId as traineeId, max(a.score) as bestScore
            from Assessment a
            where a.traineeId in :traineeIds and a.score is not null
            group by a.traineeId, a.type
            """)
    List<BestScore> findBestScorePerType(Collection<String> traineeIds);
}
