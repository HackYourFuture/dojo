package nl.hackyourfuture.dojoserver.dashboard;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.dashboard.dto.DashboardResponse;
import nl.hackyourfuture.dojoserver.dashboard.dto.DashboardResponse.CountryCount;
import nl.hackyourfuture.dojoserver.dashboard.dto.DashboardResponse.EducationLevelCount;
import nl.hackyourfuture.dojoserver.dashboard.dto.DashboardResponse.GenderCount;
import nl.hackyourfuture.dojoserver.dashboard.dto.DashboardResponse.Overview;
import nl.hackyourfuture.dojoserver.dashboard.dto.DashboardResponse.StatusCount;
import nl.hackyourfuture.dojoserver.dashboard.dto.DashboardResponse.TrackCount;
import nl.hackyourfuture.dojoserver.trainee.profile.EducationLevel;
import nl.hackyourfuture.dojoserver.trainee.profile.Gender;
import nl.hackyourfuture.dojoserver.trainee.profile.JobPath;
import nl.hackyourfuture.dojoserver.trainee.profile.LearningStatus;
import nl.hackyourfuture.dojoserver.trainee.profile.Track;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeSpecifications;
import org.springframework.data.jpa.domain.PredicateSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final TraineeRepository traineeRepository;

    // Counts in Java: there are only a few hundred trainees.
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard(Integer startCohort, Integer endCohort) {
        List<PredicateSpecification<Trainee>> filters = new ArrayList<>();
        if (startCohort != null) {
            filters.add(TraineeSpecifications.currentCohortFrom(startCohort));
        }
        if (endCohort != null) {
            filters.add(TraineeSpecifications.currentCohortTo(endCohort));
        }
        List<Trainee> trainees = traineeRepository.findAll(Specification.where(PredicateSpecification.allOf(filters)));

        return new DashboardResponse(
                overview(trainees),
                countBy(trainees, Trainee::getLearningStatus, LearningStatus.values(), StatusCount::new),
                countBy(trainees, Trainee::getTrack, Track.values(), TrackCount::new),
                countBy(trainees, Trainee::getEducationLevel, EducationLevel.values(), EducationLevelCount::new),
                countCountries(trainees),
                countBy(trainees, Trainee::getGender, Gender.values(), GenderCount::new));
    }

    private static Overview overview(List<Trainee> trainees) {
        int studying = count(trainees, t -> t.getLearningStatus() == LearningStatus.STUDYING);
        int onHold = count(trainees, t -> t.getLearningStatus() == LearningStatus.ON_HOLD);
        int searching = count(trainees, t -> isGraduate(t) && isSearching(t));
        int workingInIt = count(trainees, t -> isGraduate(t) && worksInIt(t));
        int leftWithoutItJob = count(trainees, t -> t.getLearningStatus() == LearningStatus.QUIT
                || (isGraduate(t) && !worksInIt(t) && !isSearching(t)));
        return new Overview(studying, onHold, searching, studying + onHold + searching, workingInIt,
                leftWithoutItJob, trainees.size());
    }

    private static boolean isGraduate(Trainee trainee) {
        return trainee.getLearningStatus() == LearningStatus.GRADUATED;
    }

    private static boolean isSearching(Trainee trainee) {
        return trainee.getJobPath() == JobPath.SEARCHING;
    }

    private static boolean worksInIt(Trainee trainee) {
        return trainee.getJobPath() == JobPath.INTERNSHIP || trainee.getJobPath() == JobPath.TECH_JOB;
    }

    // One row per value in the given order, then one for "not set" (null); values nobody has are left out.
    private static <T extends Enum<T>, R> List<R> countBy(List<Trainee> trainees, Function<Trainee, T> field,
            T[] values, BiFunction<T, Integer, R> row) {
        List<T> valuesAndNotSet = new ArrayList<>(Arrays.asList(values));
        valuesAndNotSet.add(null);
        List<R> rows = new ArrayList<>();
        for (T value : valuesAndNotSet) {
            int count = count(trainees, trainee -> field.apply(trainee) == value);
            if (count > 0) {
                rows.add(row.apply(value, count));
            }
        }
        return rows;
    }

    // Free text, so spellings that differ in case or spaces count as one, shown as the first in sort order.
    private static List<CountryCount> countCountries(List<Trainee> trainees) {
        Map<String, List<String>> spellingsByCountry = trainees.stream()
                .map(trainee -> trainee.getCountryOfOrigin() == null ? "" : trainee.getCountryOfOrigin().strip())
                .collect(Collectors.groupingBy(country -> country.toLowerCase(Locale.ROOT)));
        return spellingsByCountry.values().stream()
                .map(spellings -> {
                    String country = Collections.min(spellings);
                    return new CountryCount(country.isEmpty() ? null : country, spellings.size());
                })
                .sorted(Comparator.comparingInt(CountryCount::count).reversed()
                        .thenComparing(CountryCount::country, Comparator.nullsLast(Comparator.naturalOrder())))
                .toList();
    }

    private static int count(List<Trainee> trainees, Predicate<Trainee> predicate) {
        return (int) trainees.stream().filter(predicate).count();
    }
}
