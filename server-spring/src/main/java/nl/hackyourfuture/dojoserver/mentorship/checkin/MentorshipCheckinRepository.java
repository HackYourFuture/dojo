package nl.hackyourfuture.dojoserver.mentorship.checkin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface MentorshipCheckinRepository extends JpaRepository<MentorshipCheckin, String> {
    List<MentorshipCheckin> findByMentorshipIdOrderByDateDescIdAsc(String mentorshipId);

    Optional<MentorshipCheckin> findByIdAndMentorshipId(String id, String mentorshipId);

    Optional<MentorshipCheckin> findFirstByMentorshipIdOrderByDateDescIdAsc(String mentorshipId);

    // The latest check-in of each mentorship given, in one query: distinct on keeps the first row per mentorship
    // in the given order, with every column.
    @Query(value = """
            select distinct on (mentorship_id) *
            from mentorship_checkins
            where mentorship_id in :mentorshipIds
            order by mentorship_id, date desc, id
            """, nativeQuery = true)
    List<MentorshipCheckin> findLatestByMentorshipIdIn(Collection<String> mentorshipIds);
}
