package nl.hackyourfuture.dojoserver.volunteer;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.PredicateSpecification;

import java.util.List;
import java.util.Objects;

// Criteria fragments for the volunteer list filters. Each one is only built when its filter is present.
final class VolunteerSpecifications {
    private VolunteerSpecifications() {
    }

    static PredicateSpecification<Volunteer> statusIn(List<VolunteerStatus> statuses) {
        return (volunteer, cb) -> volunteer.get("status").in(statuses);
    }

    // An empty value, as in type=,tech, arrives as null.
    static PredicateSpecification<Volunteer> volunteerTypeIn(List<VolunteerType> types) {
        return (volunteer, cb) -> cb.or(types.stream()
                .filter(Objects::nonNull)
                .map(type -> arrayContains(cb, volunteer.get("volunteerTypes"), type.name()))
                .toArray(Predicate[]::new));
    }

    static PredicateSpecification<Volunteer> expertiseIn(List<VolunteerExpertise> expertise) {
        return (volunteer, cb) -> cb.or(expertise.stream()
                .filter(Objects::nonNull)
                .map(value -> arrayContains(cb, volunteer.get("expertise"), value.name()))
                .toArray(Predicate[]::new));
    }

    static PredicateSpecification<Volunteer> idIn(List<String> ids) {
        return (volunteer, cb) -> volunteer.get("id").in(ids);
    }

    // Hibernate's array functions bind an enum by its ordinal, so its name goes in as a literal. 0 is not found.
    private static Predicate arrayContains(CriteriaBuilder cb, Expression<?> array, String name) {
        return cb.greaterThan(cb.function("array_position", Integer.class, array, cb.literal(name)), 0);
    }
}
