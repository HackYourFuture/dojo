package nl.hackyourfuture.dojoserver.mentorship.checkin;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.mentorship.MentorshipRepository;
import nl.hackyourfuture.dojoserver.mentorship.checkin.dto.MentorshipCheckinRequest;
import nl.hackyourfuture.dojoserver.mentorship.checkin.dto.MentorshipCheckinResponse;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MentorshipCheckinService {
    private final MentorshipCheckinRepository checkinRepository;
    private final MentorshipRepository mentorshipRepository;

    @Transactional(readOnly = true)
    public List<MentorshipCheckinResponse> getCheckins(String mentorshipId) {
        requireMentorship(mentorshipId);
        return checkinRepository.findByMentorshipIdOrderByDateDescIdAsc(mentorshipId).stream()
                .map(MentorshipCheckinResponse::from)
                .toList();
    }

    // The latest check-in of each mentorship given, by mentorship id. A mentorship without check-ins is absent.
    @Transactional(readOnly = true)
    public Map<String, MentorshipCheckin> getLatestCheckins(Collection<String> mentorshipIds) {
        if (mentorshipIds.isEmpty()) {
            return Map.of();
        }
        return checkinRepository.findLatestByMentorshipIdIn(mentorshipIds).stream()
                .collect(Collectors.toMap(MentorshipCheckin::getMentorshipId, checkin -> checkin));
    }

    // The latest check-in of the mentorship, or null when it has none.
    @Transactional(readOnly = true)
    public MentorshipCheckin getLatestCheckin(String mentorshipId) {
        return checkinRepository.findFirstByMentorshipIdOrderByDateDescIdAsc(mentorshipId).orElse(null);
    }

    @Transactional
    public MentorshipCheckinResponse createCheckin(String mentorshipId, MentorshipCheckinRequest request) {
        requireMentorship(mentorshipId);

        var newCheckin = MentorshipCheckin.builder()
                .id(RandomUtils.generateRandomId())
                .mentorshipId(mentorshipId)
                .date(request.date())
                .notes(request.notes())
                .build();

        return MentorshipCheckinResponse.from(checkinRepository.save(newCheckin));
    }

    @Transactional
    public MentorshipCheckinResponse updateCheckin(String mentorshipId, String id, MentorshipCheckinRequest request) {
        MentorshipCheckin checkin = findCheckin(mentorshipId, id);

        checkin.setDate(request.date());
        checkin.setNotes(request.notes());

        return MentorshipCheckinResponse.from(checkin);
    }

    @Transactional
    public void deleteCheckin(String mentorshipId, String id) {
        checkinRepository.delete(findCheckin(mentorshipId, id));
    }

    // Every endpoint here is nested under a mentorship, so an unknown mentorship id is a 404 of its own.
    private void requireMentorship(String mentorshipId) {
        if (!mentorshipRepository.existsById(mentorshipId)) {
            throw new DojoNotFoundException("Mentorship", mentorshipId);
        }
    }

    private MentorshipCheckin findCheckin(String mentorshipId, String id) {
        requireMentorship(mentorshipId);
        return checkinRepository.findByIdAndMentorshipId(id, mentorshipId)
                .orElseThrow(() -> new DojoNotFoundException("Check-in", id));
    }
}
