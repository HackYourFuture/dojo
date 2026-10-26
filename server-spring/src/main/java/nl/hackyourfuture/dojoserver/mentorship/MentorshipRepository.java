package nl.hackyourfuture.dojoserver.mentorship;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MentorshipRepository
        extends JpaRepository<Mentorship, String>, JpaSpecificationExecutor<Mentorship> {

    // Redeclared to load both sides with the list, instead of one query per row.
    @Override
    @EntityGraph(attributePaths = {"volunteer", "trainee"})
    List<Mentorship> findAll(Specification<Mentorship> spec, Sort sort);
}
