package nl.hackyourfuture.dojoserver.trainee.employmenthistory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmploymentHistoryRepository extends JpaRepository<EmploymentHistory, String> {
    List<EmploymentHistory> findByTraineeIdOrderByStartDateDesc(String traineeId);

    Optional<EmploymentHistory> findByIdAndTraineeId(String id, String traineeId);
}
