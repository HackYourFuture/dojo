package nl.hackyourfuture.dojoserver.interaction;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.admin.user.UserRepository;
import nl.hackyourfuture.dojoserver.authentication.AuthenticatedUser;
import nl.hackyourfuture.dojoserver.interaction.dto.InteractionRequest;
import nl.hackyourfuture.dojoserver.interaction.dto.InteractionResponse;
import nl.hackyourfuture.dojoserver.shared.ProfileType;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoForbiddenException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import org.jspecify.annotations.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InteractionService {
    private final InteractionRepository interactionRepository;
    private final TraineeRepository traineeRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<InteractionResponse> getInteractions(ProfileType profile, String profileId) {
        requireProfile(profile, profileId);
        return findAll(profile, profileId).stream().map(InteractionResponse::from).toList();
    }

    @Transactional
    public InteractionResponse createInteraction(
            AuthenticatedUser currentUser,
            ProfileType profile,
            String profileId,
            @NonNull
            InteractionRequest request
    ) {
        requireProfile(profile, profileId);

        var reporter = userRepository.getReferenceById(currentUser.id());
        var builder = Interaction.builder()
                .id(RandomUtils.generateRandomId())
                .date(request.date())
                .reporter(reporter)
                .type(request.type())
                .title(request.title())
                .details(request.details());

        if (profile == ProfileType.TRAINEE) {
            builder.traineeId(profileId);
        }

        Interaction created = interactionRepository.save(builder.build());
        return InteractionResponse.from(created);
    }

    @Transactional
    public InteractionResponse updateInteraction(
            AuthenticatedUser currentUser,
            ProfileType profile,
            String profileId,
            String id,
            @NonNull
            InteractionRequest request
    ) {
        Interaction interaction = findInteraction(profile, profileId, id);

        if (!currentUser.id().equals(interaction.getReporter().getId())) {
            throw new DojoForbiddenException("You are not allowed to update this interaction");
        }

        interaction.setDate(request.date());
        interaction.setType(request.type());
        interaction.setTitle(request.title());
        interaction.setDetails(request.details());

        return InteractionResponse.from(interaction);
    }

    @Transactional
    public void deleteInteraction(AuthenticatedUser currentUser, ProfileType profile, String profileId, String id) {
        Interaction interaction = findInteraction(profile, profileId, id);

        if (!currentUser.id().equals(interaction.getReporter().getId())) {
            throw new DojoForbiddenException("You are not allowed to delete this interaction");
        }

        interactionRepository.delete(interaction);
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
    private Interaction findInteraction(ProfileType profile, String profileId, String id) {
        requireProfile(profile, profileId);

        var interaction = switch (profile) {
            case TRAINEE -> interactionRepository.findByIdAndTraineeId(id, profileId);
        };
        return interaction.orElseThrow(() -> new DojoNotFoundException("Interaction", id));
    }

}
