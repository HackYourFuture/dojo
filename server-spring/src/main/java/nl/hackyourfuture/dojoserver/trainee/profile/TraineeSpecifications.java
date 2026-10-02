package nl.hackyourfuture.dojoserver.trainee.profile;

import org.springframework.data.jpa.domain.PredicateSpecification;

// Criteria fragments for the trainee list filters. Each one is only built when its filter is present.
final class TraineeSpecifications {
    private TraineeSpecifications() {
    }

    static PredicateSpecification<Trainee> currentCohortFrom(Integer cohort) {
        return (trainee, cb) -> cb.greaterThanOrEqualTo(trainee.get("currentCohort"), cohort);
    }

    static PredicateSpecification<Trainee> currentCohortTo(Integer cohort) {
        return (trainee, cb) -> cb.lessThanOrEqualTo(trainee.get("currentCohort"), cohort);
    }
}
