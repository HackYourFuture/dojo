package nl.hackyourfuture.dojoserver.admin.user;

import lombok.RequiredArgsConstructor;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserPictureResponse;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserRequest;
import nl.hackyourfuture.dojoserver.admin.user.dto.UserResponse;
import nl.hackyourfuture.dojoserver.authentication.token.TokenService;
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.picture.PictureService;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoConflictException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final TokenService tokenService;
    private final PictureService pictureService;

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

        // Make a user inactive revokes all its auth tokens
        if (user.isActive() && !request.isActive()) {
            tokenService.revokeAllForUser(id);
        }

        user.setEmail(request.email());
        user.setName(request.name());
        user.setActive(request.isActive());
        return UserResponse.from(user);
    }

    @Transactional
    public void deleteUser(String id) {
        User user = userRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("User", id));
        tokenService.revokeAllForUser(id);
        userRepository.delete(user);
        // Flush before touching storage: a user who reported an interaction fails here and keeps the pictures.
        userRepository.flush();
        pictureService.deleteAll(user);
    }

    @Transactional(readOnly = true)
    public StoredFile getPicture(String userId, String pictureId) {
        User user = findUser(userId);
        return pictureService.download(user, pictureId);
    }

    @Transactional(readOnly = true)
    public StoredFile getThumbnail(String userId, String pictureId) {
        User user = findUser(userId);
        return pictureService.downloadThumbnail(user, pictureId);
    }

    @Transactional
    public UserPictureResponse setPicture(String id, MultipartFile file) {
        User user = findUser(id);
        pictureService.save(user, file);
        return UserPictureResponse.from(user);
    }

    @Transactional
    public void deletePicture(String userId, String pictureId) {
        User user = findUser(userId);
        pictureService.delete(user, pictureId);
    }

    private User findUser(String id) {
        return userRepository.findById(id).orElseThrow(() -> new DojoNotFoundException("User", id));
    }
}
