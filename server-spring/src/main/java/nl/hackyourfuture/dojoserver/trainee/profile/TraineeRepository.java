package nl.hackyourfuture.dojoserver.trainee.profile;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TraineeRepository extends JpaRepository<Trainee, String>, JpaSpecificationExecutor<Trainee> {
    boolean existsByEmailIgnoreCase(String email);

    // The list and the profile show the city, so it is joined in. The plain findAll() of the search and the
    // dashboard doesn't read it.
    @Override
    @EntityGraph(attributePaths = "city")
    Page<Trainee> findAll(Specification<Trainee> spec, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = "city")
    Optional<Trainee> findById(String id);
}
