package nl.hackyourfuture.dojoserver.volunteer.pairing;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import nl.hackyourfuture.dojoserver.volunteer.VolunteerRepository;
import nl.hackyourfuture.dojoserver.volunteer.pairing.dto.MentorPairingRequest;
import nl.hackyourfuture.dojoserver.volunteer.pairing.dto.MentorPairingResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorPairingService {
    private final MentorPairingRepository pairingRepository;
    private final VolunteerRepository volunteerRepository;
    private final TraineeRepository traineeRepository;

    @Transactional(readOnly = true)
    public List<MentorPairingResponse> getPairings(String volunteerId) {
        requireVolunteer(volunteerId);
        return pairingRepository.findByVolunteerIdOrderByStartDateDescIdAsc(volunteerId).stream()
                .map(MentorPairingResponse::from)
                .toList();
    }

    @Transactional
    public MentorPairingResponse createPairing(String volunteerId, MentorPairingRequest request) {
        requireVolunteer(volunteerId);
        validateDates(request);

        var newPairing = MentorPairing.builder()
                .id(RandomUtils.generateRandomId())
                .volunteerId(volunteerId)
                .trainee(requireTrainee(request.traineeId()))
                .type(request.type())
                .startDate(request.startDate())
                .lastCheckinDate(request.lastCheckinDate())
                .endDate(request.endDate())
                .nextCheckinDate(request.nextCheckinDate())
                .build();

        return MentorPairingResponse.from(pairingRepository.save(newPairing));
    }

    @Transactional
    public MentorPairingResponse updatePairing(String volunteerId, String id, MentorPairingRequest request) {
        MentorPairing pairing = findPairing(volunteerId, id);
        validateDates(request);

        pairing.setTrainee(requireTrainee(request.traineeId()));
        pairing.setType(request.type());
        pairing.setStartDate(request.startDate());
        pairing.setLastCheckinDate(request.lastCheckinDate());
        pairing.setEndDate(request.endDate());
        pairing.setNextCheckinDate(request.nextCheckinDate());

        return MentorPairingResponse.from(pairing);
    }

    @Transactional
    public void deletePairing(String volunteerId, String id) {
        pairingRepository.delete(findPairing(volunteerId, id));
    }

    private void requireVolunteer(String volunteerId) {
        if (!volunteerRepository.existsById(volunteerId)) {
            throw new DojoNotFoundException("Volunteer", volunteerId);
        }
    }

    private Trainee requireTrainee(String traineeId) {
        return traineeRepository.findById(traineeId).orElseThrow(() -> new DojoBadRequestException(
                "The trainee with id '" + traineeId + "' does not exist."));
    }

    private MentorPairing findPairing(String volunteerId, String id) {
        requireVolunteer(volunteerId);
        return pairingRepository.findByIdAndVolunteerId(id, volunteerId)
                .orElseThrow(() -> new DojoNotFoundException("Mentor pairing", id));
    }

    private void validateDates(MentorPairingRequest request) {
        if (request.endDate() != null && request.endDate().isBefore(request.startDate())) {
            throw new DojoBadRequestException("The end date cannot be before the start date.");
        }
    }
}
