package nl.hackyourfuture.dojoserver.admin.user;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserRequest;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserResponse;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
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

    @Transactional
    public UserResponse createUser(UserRequest request) {
        var newUser = User.builder()
                .id(RandomUtils.generateRandomId())
                .email(request.email().toLowerCase())
                .build();

        var created = userRepository.save(newUser);
        return UserResponse.from(created);
    }

    /** Loads and mutates: save() on a detached User would merge, inserting a row for a bad id. */
    @Transactional
    public UserResponse updateUser(String id, UserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("User", id));

        user.setEmail(request.email().toLowerCase());
        return UserResponse.from(user);
    }

    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("User", id));
        userRepository.delete(user);
    }
}
