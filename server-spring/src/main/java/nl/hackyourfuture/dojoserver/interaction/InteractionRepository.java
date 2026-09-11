package nl.hackyourfuture.dojoserver.interaction;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InteractionRepository extends JpaRepository<Interaction, String> {
    @EntityGraph(attributePaths = "reporter")
    List<Interaction> findByTraineeIdOrderByDateDesc(String traineeId);

    @EntityGraph(attributePaths = "reporter")
    Optional<Interaction> findByIdAndTraineeId(String id, String traineeId);
}
