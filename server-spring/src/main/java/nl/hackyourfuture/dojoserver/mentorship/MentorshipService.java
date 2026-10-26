package nl.hackyourfuture.dojoserver.mentorship;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.mentorship.checkin.MentorshipCheckin;
import nl.hackyourfuture.dojoserver.mentorship.checkin.MentorshipCheckinService;
import nl.hackyourfuture.dojoserver.mentorship.dto.MentorshipRequest;
import nl.hackyourfuture.dojoserver.mentorship.dto.MentorshipResponse;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import nl.hackyourfuture.dojoserver.volunteer.Volunteer;
import nl.hackyourfuture.dojoserver.volunteer.VolunteerRepository;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.PredicateSpecification;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MentorshipService {
    private final MentorshipRepository mentorshipRepository;
    private final VolunteerRepository volunteerRepository;
    private final TraineeRepository traineeRepository;
    private final MentorshipCheckinService checkinService;

    @Transactional(readOnly = true)
    public List<MentorshipResponse> getMentorships(String volunteerId, String traineeId) {
        List<PredicateSpecification<Mentorship>> filters = new ArrayList<>();
        if (volunteerId != null && !volunteerId.isBlank()) {
            filters.add(MentorshipSpecifications.volunteerIs(volunteerId));
        }
        if (traineeId != null && !traineeId.isBlank()) {
            filters.add(MentorshipSpecifications.traineeIs(traineeId));
        }

        Specification<Mentorship> spec = Specification.where(PredicateSpecification.allOf(filters));
        // Latest start first. The id keeps mentorships that started on the same day in a fixed order.
        Sort latestStartFirst = Sort.by(Sort.Order.desc("startDate"), Sort.Order.asc("id"));
        List<Mentorship> mentorships = mentorshipRepository.findAll(spec, latestStartFirst);

        // Get the latest check-in of all mentorships in one query
        List<String> mentorshipIds = mentorships.stream().map(Mentorship::getId).toList();
        Map<String, MentorshipCheckin> latestCheckins = checkinService.getLatestCheckins(mentorshipIds);

        return mentorships.stream()
                .map(mentorship -> MentorshipResponse.from(mentorship, latestCheckins.get(mentorship.getId())))
                .toList();
    }

    @Transactional(readOnly = true)
    public MentorshipResponse getMentorship(String id) {
        return MentorshipResponse.from(findMentorship(id), checkinService.getLatestCheckin(id));
    }

    @Transactional
    public MentorshipResponse createMentorship(MentorshipRequest request) {
        validateDates(request);

        var newMentorship = Mentorship.builder()
                .id(RandomUtils.generateRandomId())
                .volunteer(requireVolunteer(request.volunteerId()))
                .trainee(requireTrainee(request.traineeId()))
                .type(request.type())
                .startDate(request.startDate())
                .endDate(request.endDate())
                .nextCheckinDate(request.nextCheckinDate())
                .build();

        // A new mentorship has no check-ins yet.
        return MentorshipResponse.from(mentorshipRepository.save(newMentorship), null);
    }

    @Transactional
    public MentorshipResponse updateMentorship(String id, MentorshipRequest request) {
        Mentorship mentorship = findMentorship(id);
        validateDates(request);

        mentorship.setVolunteer(requireVolunteer(request.volunteerId()));
        mentorship.setTrainee(requireTrainee(request.traineeId()));
        mentorship.setType(request.type());
        mentorship.setStartDate(request.startDate());
        mentorship.setEndDate(request.endDate());
        mentorship.setNextCheckinDate(request.nextCheckinDate());

        return MentorshipResponse.from(mentorship, checkinService.getLatestCheckin(id));
    }

    @Transactional
    public void deleteMentorship(String id) {
        mentorshipRepository.delete(findMentorship(id));
    }

    private Mentorship findMentorship(String id) {
        return mentorshipRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Mentorship", id));
    }

    private Volunteer requireVolunteer(String volunteerId) {
        return volunteerRepository.findById(volunteerId).orElseThrow(() -> new DojoBadRequestException(
                "The volunteer with id '" + volunteerId + "' does not exist."));
    }

    private Trainee requireTrainee(String traineeId) {
        return traineeRepository.findById(traineeId).orElseThrow(() -> new DojoBadRequestException(
                "The trainee with id '" + traineeId + "' does not exist."));
    }

    private void validateDates(MentorshipRequest request) {
        if (request.endDate() != null && request.endDate().isBefore(request.startDate())) {
            throw new DojoBadRequestException("The end date cannot be before the start date.");
        }
    }
}
