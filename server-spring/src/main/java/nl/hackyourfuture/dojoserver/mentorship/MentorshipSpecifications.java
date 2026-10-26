package nl.hackyourfuture.dojoserver.mentorship;

import org.springframework.data.jpa.domain.PredicateSpecification;

// Criteria fragments for the mentorship list filters. Each one is only built when its filter is present.
final class MentorshipSpecifications {
    private MentorshipSpecifications() {
    }

    static PredicateSpecification<Mentorship> volunteerIs(String volunteerId) {
        return (mentorship, cb) -> cb.equal(mentorship.get("volunteer").get("id"), volunteerId);
    }

    static PredicateSpecification<Mentorship> traineeIs(String traineeId) {
        return (mentorship, cb) -> cb.equal(mentorship.get("trainee").get("id"), traineeId);
    }
}
