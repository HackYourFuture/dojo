package nl.hackyourfuture.dojoserver.trainee.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface TraineeRepository extends JpaRepository<Trainee, String>, JpaSpecificationExecutor<Trainee> {
    boolean existsByEmailIgnoreCase(String email);
}
