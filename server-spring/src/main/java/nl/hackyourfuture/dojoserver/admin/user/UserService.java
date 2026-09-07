package nl.hackyourfuture.dojoserver.admin.user;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserRequest;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserResponse;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoConflictException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream().map(UserResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public UserResponse getUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("User", id));
        return UserResponse.from(user);
    }

    @Transactional
    public UserResponse createUser(UserRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DojoConflictException("Email is already in use by another user.");
        }

        var newUser = User.builder()
                .id(RandomUtils.generateRandomId())
                .email(request.email())
                .name(request.name())
                .imageUrl(request.imageUrl())
                .isActive(request.isActive())
                .build();

        var created = userRepository.save(newUser);
        return UserResponse.from(created);
    }

    @Transactional
    public UserResponse updateUser(String id, UserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("User", id));

        // Changed email - check for duplicates.
        if (!user.getEmail().equalsIgnoreCase(request.email()) &&
                userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new DojoConflictException("Email is already in use by another user.");
        }

        user.setEmail(request.email());
        user.setName(request.name());
        user.setImageUrl(request.imageUrl());
        user.setActive(request.isActive());
        return UserResponse.from(user);
    }

    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("User", id));
        userRepository.delete(user);
    }
}
