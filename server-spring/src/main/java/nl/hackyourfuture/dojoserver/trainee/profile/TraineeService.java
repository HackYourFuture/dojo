package nl.hackyourfuture.dojoserver.trainee.profile;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.shared.JsonMergePatch;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoConflictException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeRequest;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeResponse;
import nl.hackyourfuture.dojoserver.trainee.profile.dto.TraineeSummaryResponse;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import tools.jackson.databind.node.ObjectNode;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TraineeService {
    private final TraineeRepository traineeRepository;
    private final JsonMergePatch jsonMergePatch;

    @Transactional(readOnly = true)
    public List<TraineeSummaryResponse> getAllTrainees() {
        return traineeRepository.findAll().stream().map(TraineeSummaryResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public TraineeResponse getTrainee(String id) {
        Trainee trainee = traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
        return TraineeResponse.from(trainee);
    }

    @Transactional
    public TraineeResponse createTrainee(TraineeRequest request) {
        if (traineeRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DojoConflictException("Email is already in use by another trainee.");
        }

        var newTrainee = Trainee.builder()
                .id(RandomUtils.generateRandomId())
                .imageUrl(request.imageUrl())
                .thumbnailUrl(request.thumbnailUrl())
                .firstName(request.firstName())
                .lastName(request.lastName())
                .preferredName(request.preferredName())
                .email(request.email())
                .gender(request.gender())
                .pronouns(request.pronouns())
                .build();

        var created = traineeRepository.save(newTrainee);
        return TraineeResponse.from(created);
    }

    /**
     * Partial update: the fields the caller sent are applied on top of the stored trainee and the
     * result is validated as a whole, so the create rules hold for anything that changed.
     */
    @Transactional
    public TraineeResponse updateTrainee(String id, ObjectNode patch) {
        Trainee trainee = traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
        TraineeRequest merged = jsonMergePatch.apply(TraineeRequest.from(trainee), patch);

        setEmail(trainee, merged.email());
        trainee.setImageUrl(merged.imageUrl());
        trainee.setThumbnailUrl(merged.thumbnailUrl());
        trainee.setFirstName(merged.firstName());
        trainee.setLastName(merged.lastName());
        trainee.setPreferredName(merged.preferredName());
        trainee.setGender(merged.gender());
        trainee.setPronouns(merged.pronouns());
        return TraineeResponse.from(trainee);
    }

    @Transactional
    public void deleteTrainee(String id) {
        Trainee trainee = traineeRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("Trainee", id));
        traineeRepository.delete(trainee);
    }

    // Changed email - check for duplicates. A plain rename would otherwise conflict with itself.
    private void setEmail(Trainee trainee, String email) {
        if (!trainee.getEmail().equalsIgnoreCase(email) && traineeRepository.existsByEmailIgnoreCase(email)) {
            throw new DojoConflictException("Email is already in use by another trainee.");
        }
        trainee.setEmail(email);
    }
}
