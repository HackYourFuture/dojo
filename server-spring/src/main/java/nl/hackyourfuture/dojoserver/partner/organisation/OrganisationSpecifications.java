package nl.hackyourfuture.dojoserver.partner.organisation;

import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Expression;
import jakarta.persistence.criteria.Predicate;
import org.hibernate.query.criteria.HibernateCriteriaBuilder;
import org.springframework.data.jpa.domain.PredicateSpecification;

import java.util.List;
import java.util.Objects;

// Criteria fragments for the organisation list filters. Each one is only built when its filter is present.
final class OrganisationSpecifications {
    private OrganisationSpecifications() {
    }

    // The plain overlap is text[] && varchar[], which Postgres has no operator for. The nullable one unnests both.
    static PredicateSpecification<Organisation> responsibleIdIn(List<String> userIds) {
        return (organisation, cb) -> ((HibernateCriteriaBuilder) cb)
                .collectionOverlapsNullable(organisation.<List<String>>get("responsibleIds"), userIds);
    }

    // An empty value, as in partnership=,funding, arrives as null.
    static PredicateSpecification<Organisation> partnershipTypeIn(List<PartnershipType> partnershipTypes) {
        return (organisation, cb) -> cb.or(partnershipTypes.stream()
                .filter(Objects::nonNull)
                .map(type -> arrayContains(cb, organisation.get("partnershipTypes"), type.name()))
                .toArray(Predicate[]::new));
    }

    static PredicateSpecification<Organisation> provinceIn(List<String> provinces) {
        return (organisation, cb) -> organisation.get("city").get("province").in(provinces);
    }

    static PredicateSpecification<Organisation> idIn(List<String> ids) {
        return (organisation, cb) -> organisation.get("id").in(ids);
    }

    // Hibernate's array functions bind an enum by its ordinal, so its name goes in as a literal. 0 is not found.
    private static Predicate arrayContains(CriteriaBuilder cb, Expression<?> array, String name) {
        return cb.greaterThan(cb.function("array_position", Integer.class, array, cb.literal(name)), 0);
    }
}
