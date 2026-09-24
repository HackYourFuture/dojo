package nl.hackyourfuture.dojoserver.admin.user;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import jakarta.persistence.EntityManager;
import nl.hackyourfuture.dojoserver.filestorage.FileStorageService;
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.interaction.Interaction;
import nl.hackyourfuture.dojoserver.interaction.InteractionRepository;
import nl.hackyourfuture.dojoserver.interaction.InteractionType;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.trainee.profile.JobPath;
import nl.hackyourfuture.dojoserver.trainee.profile.LearningStatus;
import nl.hackyourfuture.dojoserver.trainee.profile.Track;
import nl.hackyourfuture.dojoserver.trainee.profile.Trainee;
import nl.hackyourfuture.dojoserver.trainee.profile.TraineeRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;
import org.springframework.test.web.servlet.assertj.MvcTestResult;
import org.springframework.transaction.annotation.Transactional;

import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.Instant;

/** User pictures over MockMvc. Storage is mocked because CI has no S3; transactional like TraineeListTest. */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
public class UserPictureTest {

    private static final String CURRENT = "IMGcurrent0001";
    private static final String STALE = "IMGstale00001";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TraineeRepository traineeRepository;
    @Autowired
    private InteractionRepository interactionRepository;
    @Autowired
    private EntityManager entityManager;
    @MockitoBean
    private FileStorageService fileStorageService;

    private User user;
    private String prefix;

    @BeforeEach
    void givenAUser() {
        user = userRepository.save(User.builder()
                .id(RandomUtils.generateRandomId())
                .email(RandomUtils.generateRandomId() + "@example.org")
                .name("Picture Test")
                .isActive(true)
                .build());
        prefix = "images/users/" + user.getId() + "/";
    }

    @Test
    void uploadReturnsThePictureAndThumbnailUrls() throws IOException {
        MvcTestResult result = mvc.put().uri("/api/admin/users/{id}/picture", user.getId())
                .multipart()
                .file(png())
                .exchange();

        String pictureUrl = "/api/admin/users/" + user.getId() + "/picture/" + user.getPictureId();
        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.pictureUrl").isEqualTo(pictureUrl);
        assertThat(result).bodyJson().extractingPath("$.thumbnailUrl").isEqualTo(pictureUrl + "/thumbnail");
    }

    @Test
    void thePictureAndThumbnailAreServedWithTheCacheHeader() {
        user.setPictureId(CURRENT);
        when(fileStorageService.download(anyString()))
                .thenAnswer(call -> new StoredFile(new ByteArrayInputStream(new byte[]{1, 2, 3}), "image/jpeg", 3));

        for (String suffix : new String[]{"", "/thumbnail"}) {
            assertThat(mvc.get().uri("/api/admin/users/{id}/picture/{pictureId}" + suffix, user.getId(), CURRENT))
                    .hasStatusOk()
                    .headers().hasValue("Cache-Control", "max-age=31536000, private, immutable");
        }
        verify(fileStorageService).download(prefix + CURRENT);
        verify(fileStorageService).download(prefix + CURRENT + "_thumb");
    }

    @Test
    void aStalePictureIdIsNotFound() {
        user.setPictureId(CURRENT);

        assertThat(mvc.get().uri("/api/admin/users/{id}/picture/{pictureId}", user.getId(), STALE))
                .hasStatus(HttpStatus.NOT_FOUND);
        assertThat(mvc.delete().uri("/api/admin/users/{id}/picture/{pictureId}", user.getId(), STALE))
                .hasStatus(HttpStatus.NOT_FOUND);
        verifyNoInteractions(fileStorageService);
    }

    @Test
    void deletingThePictureRemovesItsFiles() {
        user.setPictureId(CURRENT);

        assertThat(mvc.delete().uri("/api/admin/users/{id}/picture/{pictureId}", user.getId(), CURRENT))
                .hasStatus(HttpStatus.NO_CONTENT);
        assertThat(user.getPictureId()).isNull();
        verify(fileStorageService).delete(prefix + CURRENT);
        verify(fileStorageService).delete(prefix + CURRENT + "_thumb");
    }

    @Test
    void deletingAUserSweepsTheirPictures() {
        assertThat(mvc.delete().uri("/api/admin/users/{id}", user.getId())).hasStatus(HttpStatus.NO_CONTENT);
        verify(fileStorageService).deleteAllWithPrefix(prefix);
    }

    @Test
    void aUserWhoReportedAnInteractionIsNotDeletedAndKeepsTheirPictures() {
        Trainee trainee = traineeRepository.save(Trainee.builder()
                .id(RandomUtils.generateRandomId())
                .firstName("Ann")
                .lastName("Reported")
                .email(RandomUtils.generateRandomId() + "@example.org")
                .startCohort(9001)
                .track(Track.CORE_PROGRAM)
                .learningStatus(LearningStatus.STUDYING)
                .jobPath(JobPath.NOT_GRADUATED)
                .build());
        interactionRepository.save(Interaction.builder()
                .id(RandomUtils.generateRandomId())
                .traineeId(trainee.getId())
                .date(Instant.now())
                .type(InteractionType.CALL)
                .reporter(user)
                .title("Check-in")
                .details("Talked about the assignment")
                .build());
        // Start the request with a clean persistence context, like a real one.
        entityManager.flush();
        entityManager.clear();

        assertThat(mvc.delete().uri("/api/admin/users/{id}", user.getId())).hasStatus(HttpStatus.CONFLICT);
        verify(fileStorageService, never()).deleteAllWithPrefix(anyString());
    }

    private static MockMultipartFile png() throws IOException {
        var out = new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(40, 30, BufferedImage.TYPE_INT_RGB), "png", out);
        return new MockMultipartFile("picture", "picture.png", "image/png", out.toByteArray());
    }
}
