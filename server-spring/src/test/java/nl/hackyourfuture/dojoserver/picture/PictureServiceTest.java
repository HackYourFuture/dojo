package nl.hackyourfuture.dojoserver.picture;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;

import nl.hackyourfuture.dojoserver.admin.user.User;
import nl.hackyourfuture.dojoserver.filestorage.FileStorageService;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockMultipartFile;

import javax.imageio.ImageIO;

import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

public class PictureServiceTest {

    private static final String PREFIX = "images/users/WTh1qLhy3K/";
    private static final String CURRENT = "IMGcurrent0001";
    private static final String STALE = "IMGstale00001";

    private final FileStorageService fileStorageService = mock(FileStorageService.class);
    private final PictureService pictureService = new PictureService(fileStorageService);

    @Test
    void saveStoresThePictureAndItsThumbnail() throws IOException {
        User user = user(null);

        pictureService.save(user, png());

        String pictureId = user.getPictureId();
        assertThat(pictureId).startsWith("IMG").hasSize(13);
        verify(fileStorageService).upload(eq(PREFIX + pictureId), eq("image/jpeg"), any(InputStream.class), anyLong());
        verify(fileStorageService).upload(eq(PREFIX + pictureId + "_thumb"), eq("image/jpeg"), any(InputStream.class),
                anyLong());
        verify(fileStorageService, never()).delete(anyString());
    }

    @Test
    void saveDeletesTheOldFiles() throws IOException {
        User user = user(CURRENT);

        pictureService.save(user, png());

        assertThat(user.getPictureId()).isNotEqualTo(CURRENT);
        verify(fileStorageService).delete(PREFIX + CURRENT);
        verify(fileStorageService).delete(PREFIX + CURRENT + "_thumb");
    }

    @Test
    void saveSucceedsWhenTheOldFilesCannotBeDeleted() throws IOException {
        User user = user(CURRENT);
        doThrow(new IllegalStateException("storage is down")).when(fileStorageService).delete(anyString());

        pictureService.save(user, png());

        assertThat(user.getPictureId()).isNotEqualTo(CURRENT);
    }

    @Test
    void anEmptyFileIsRejected() {
        var empty = new MockMultipartFile("picture", "picture.png", "image/png", new byte[0]);

        assertThatThrownBy(() -> pictureService.save(user(null), empty)).isInstanceOf(
                DojoBadRequestException.class);
        verifyNoInteractions(fileStorageService);
    }

    @Test
    void aFileThatIsNotAnImageTypeIsRejected() {
        var text = new MockMultipartFile("picture", "notes.txt", "text/plain", bytes("hello"));

        assertThatThrownBy(() -> pictureService.save(user(null), text)).isInstanceOf(DojoBadRequestException.class);
        verifyNoInteractions(fileStorageService);
    }

    @Test
    void bytesThatAreNotAnImageAreRejected() {
        var fake = new MockMultipartFile("picture", "fake.png", "image/png", bytes("<html></html>"));

        assertThatThrownBy(() -> pictureService.save(user(null), fake)).isInstanceOf(DojoBadRequestException.class);
        verifyNoInteractions(fileStorageService);
    }

    @Test
    void downloadReadsTheCurrentPictureAndThumbnail() {
        User user = user(CURRENT);

        pictureService.download(user, CURRENT);
        pictureService.downloadThumbnail(user, CURRENT);

        verify(fileStorageService).download(PREFIX + CURRENT);
        verify(fileStorageService).download(PREFIX + CURRENT + "_thumb");
    }

    @Test
    void aStaleOrMissingPictureIdIsNotFound() {
        User user = user(CURRENT);

        assertThatThrownBy(() -> pictureService.download(user, STALE)).isInstanceOf(DojoNotFoundException.class);
        assertThatThrownBy(() -> pictureService.downloadThumbnail(user, STALE))
                .isInstanceOf(DojoNotFoundException.class);
        assertThatThrownBy(() -> pictureService.delete(user, STALE)).isInstanceOf(DojoNotFoundException.class);
        assertThatThrownBy(() -> pictureService.download(user(null), STALE)).isInstanceOf(DojoNotFoundException.class);
        verifyNoInteractions(fileStorageService);
    }

    @Test
    void deleteRemovesBothFilesAndClearsTheId() {
        User user = user(CURRENT);

        pictureService.delete(user, CURRENT);

        assertThat(user.getPictureId()).isNull();
        verify(fileStorageService).delete(PREFIX + CURRENT);
        verify(fileStorageService).delete(PREFIX + CURRENT + "_thumb");
    }

    @Test
    void deleteAllSweepsTheOwnersFolder() {
        pictureService.deleteAll(user(CURRENT));

        verify(fileStorageService).deleteAllWithPrefix(PREFIX);
    }

    private static User user(String pictureId) {
        return User.builder()
                .id("WTh1qLhy3K")
                .email("jane.doe@example.org")
                .name("Jane Doe")
                .pictureId(pictureId)
                .isActive(true)
                .build();
    }

    private static MockMultipartFile png() throws IOException {
        var out = new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(40, 30, BufferedImage.TYPE_INT_RGB), "png", out);
        return new MockMultipartFile("picture", "picture.png", "image/png", out.toByteArray());
    }

    private static byte[] bytes(String text) {
        return text.getBytes(StandardCharsets.UTF_8);
    }
}
