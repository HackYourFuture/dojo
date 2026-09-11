package nl.hackyourfuture.dojoserver.interaction;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.admin.user.dto.ReporterResponse;
import nl.hackyourfuture.dojoserver.interaction.dto.InteractionRequest;
import nl.hackyourfuture.dojoserver.interaction.dto.InteractionResponse;
import nl.hackyourfuture.dojoserver.shared.ProfileType;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InteractionService {
    private final InteractionRepository interactionRepository;
    private final TraineeRepository traineeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<InteractionResponse> getInteractions(ProfileType profile, String profileId) {
        requireProfile(profile, profileId);
        return toResponses(findAll(profile, profileId));
    }

    @Transactional
    public InteractionResponse createInteraction(ProfileType profile, String profileId,
            InteractionRequest request) {
        requireProfile(profile, profileId);

        var builder = Interaction.builder()
                .id(RandomUtils.generateRandomId())
                .date(request.date())
                .type(request.type())
                .title(request.title())
                .details(request.details());

        // The arc column depends on the profile, so it cannot be part of the chain above.
        switch (profile) {
            case TRAINEE -> builder.traineeId(profileId);
        }

        Interaction created = interactionRepository.save(builder.build());
        return toResponse(created);
    }

    @Transactional
    public InteractionResponse updateInteraction(ProfileType profile, String profileId, String id,
            InteractionRequest request) {
        Interaction interaction = findOne(profile, profileId, id);

        // The reporter is deliberately left alone: editing an interaction must not reassign it.
        interaction.setDate(request.date());
        interaction.setType(request.type());
        interaction.setTitle(request.title());
        interaction.setDetails(request.details());

        return toResponse(interaction);
    }

    @Transactional
    public void deleteInteraction(ProfileType profile, String profileId, String id) {
        interactionRepository.delete(findOne(profile, profileId, id));
    }

    /** Every endpoint here is nested under a profile, so an unknown profile id is a 404 of its own. */
    private void requireProfile(ProfileType profile, String profileId) {
        boolean exists = switch (profile) {
            case TRAINEE -> traineeRepository.existsById(profileId);
        };

        if (!exists) {
            throw new DojoNotFoundException(profile.getLabel(), profileId);
        }
    }

    private List<Interaction> findAll(ProfileType profile, String profileId) {
        return switch (profile) {
            case TRAINEE -> interactionRepository.findByTraineeIdOrderByDateDesc(profileId);
        };
    }

    /** Looks up by profile as well as by id, so one profile cannot reach another's interactions. */
    private Interaction findOne(ProfileType profile, String profileId, String id) {
        requireProfile(profile, profileId);

        return (switch (profile) {
            case TRAINEE -> interactionRepository.findByIdAndTraineeId(id, profileId);
        }).orElseThrow(() -> new DojoNotFoundException("Interaction", id));
    }

    private InteractionResponse toResponse(Interaction interaction) {
        ReporterResponse reporter = interaction.getReporterId() == null ? null
                : userRepository.findById(interaction.getReporterId()).map(ReporterResponse::from).orElse(null);

        return InteractionResponse.from(interaction, reporter);
    }

    /** Reporters are batch-loaded so a list costs two queries instead of one per interaction. */
    private List<InteractionResponse> toResponses(List<Interaction> interactions) {
        List<String> reporterIds = interactions.stream()
                .map(Interaction::getReporterId)
                .filter(Objects::nonNull)
                .toList();

        Map<String, ReporterResponse> reporters = userRepository.findAllById(reporterIds).stream()
                .collect(Collectors.toMap(User::getId, ReporterResponse::from));

        return interactions.stream()
                .map(interaction -> InteractionResponse.from(interaction, reporters.get(interaction.getReporterId())))
                .toList();
    }
}
