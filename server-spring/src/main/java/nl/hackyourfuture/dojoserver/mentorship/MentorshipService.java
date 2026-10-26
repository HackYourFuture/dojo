package nl.hackyourfuture.dojoserver.mentorship;

import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
public class MentorshipService {
    // Latest start first; the id keeps mentorships that started on the same day in a fixed order.

    private final MentorshipRepository mentorshipRepository;
    private final VolunteerRepository volunteerRepository;
    private final TraineeRepository traineeRepository;

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
        final Sort latestStartFirst = Sort.by(Sort.Order.desc("startDate"), Sort.Order.asc("id"));
        return mentorshipRepository.findAll(spec, latestStartFirst).stream()
                .map(MentorshipResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public MentorshipResponse getMentorship(String id) {
        return MentorshipResponse.from(findMentorship(id));
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

        return MentorshipResponse.from(mentorshipRepository.save(newMentorship));
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

        return MentorshipResponse.from(mentorship);
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
