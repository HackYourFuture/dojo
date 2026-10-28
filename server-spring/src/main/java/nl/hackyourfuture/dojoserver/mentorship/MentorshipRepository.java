package nl.hackyourfuture.dojoserver.mentorship;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MentorshipRepository
        extends JpaRepository<Mentorship, String>, JpaSpecificationExecutor<Mentorship> {

    // Redeclared to load both sides with the list, instead of one query per row.
    @Override
    @EntityGraph(attributePaths = {"volunteer", "trainee"})
    Page<Mentorship> findAll(Specification<Mentorship> spec, Pageable pageable);

    // One row per volunteer with an active mentorship: no end date, or one after today, like its ended flag.
    @Query("""
            select volunteer.id, count(*)
            from Mentorship
            where endDate is null or endDate > :today
            group by volunteer.id
            """)
    List<ActiveMentorshipCount> countActivePerVolunteer(LocalDate today);
}
