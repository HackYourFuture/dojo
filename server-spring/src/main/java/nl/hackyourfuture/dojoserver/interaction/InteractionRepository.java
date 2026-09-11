package nl.hackyourfuture.dojoserver.interaction;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, String> {
    List<Interaction> findByTraineeIdOrderByDateDesc(String traineeId);

    Optional<Interaction> findByIdAndTraineeId(String id, String traineeId);
}
