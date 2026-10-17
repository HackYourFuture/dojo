package nl.hackyourfuture.dojoserver.trainee.profile;

import org.springframework.data.jpa.domain.PredicateSpecification;

import java.util.List;

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

    static PredicateSpecification<Trainee> learningStatusIn(List<LearningStatus> statuses) {
        return (trainee, cb) -> trainee.get("learningStatus").in(statuses);
    }

    static PredicateSpecification<Trainee> jobPathIn(List<JobPath> jobPaths) {
        return (trainee, cb) -> trainee.get("jobPath").in(jobPaths);
    }

    static PredicateSpecification<Trainee> provinceIn(List<String> provinces) {
        return (trainee, cb) -> trainee.get("city").get("province").in(provinces);
    }

    static PredicateSpecification<Trainee> idIn(List<String> ids) {
        return (trainee, cb) -> trainee.get("id").in(ids);
    }
}
