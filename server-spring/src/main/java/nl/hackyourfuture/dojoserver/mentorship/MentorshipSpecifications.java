package nl.hackyourfuture.dojoserver.mentorship;

import org.springframework.data.jpa.domain.PredicateSpecification;

import java.time.LocalDate;
import java.util.List;

// Criteria fragments for the mentorship list filters. Each one is only built when its filter is present.
final class MentorshipSpecifications {
    private MentorshipSpecifications() {
    }

    static PredicateSpecification<Mentorship> volunteerIdIn(List<String> volunteerIds) {
        return (mentorship, cb) -> mentorship.get("volunteer").get("id").in(volunteerIds);
    }

    static PredicateSpecification<Mentorship> traineeIdIn(List<String> traineeIds) {
        return (mentorship, cb) -> mentorship.get("trainee").get("id").in(traineeIds);
    }

    static PredicateSpecification<Mentorship> typeIn(List<MentorshipType> types) {
        return (mentorship, cb) -> mentorship.get("type").in(types);
    }

    static PredicateSpecification<Mentorship> startDateFrom(LocalDate date) {
        return (mentorship, cb) -> cb.greaterThanOrEqualTo(mentorship.get("startDate"), date);
    }

    static PredicateSpecification<Mentorship> startDateTo(LocalDate date) {
        return (mentorship, cb) -> cb.lessThanOrEqualTo(mentorship.get("startDate"), date);
    }

    // A mentorship without an end date is still running, so it ends after any date.
    static PredicateSpecification<Mentorship> endDateFrom(LocalDate date) {
        return (mentorship, cb) -> cb.or(cb.isNull(mentorship.get("endDate")),
                cb.greaterThanOrEqualTo(mentorship.get("endDate"), date));
    }

    static PredicateSpecification<Mentorship> endDateTo(LocalDate date) {
        return (mentorship, cb) -> cb.lessThanOrEqualTo(mentorship.get("endDate"), date);
    }
}
