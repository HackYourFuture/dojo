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
import nl.hackyourfuture.dojoserver.partner.organisation.Organisation;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mock.web.MockMultipartFile;

import javax.imageio.ImageIO;

import java.awt.Color;
import java.awt.Graphics2D;
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
    void aPictureIsCroppedToFillTheSquare() throws IOException {
        BufferedImage stored = savedPicture(user(null));

        // Only the green middle of the red|green|blue strip is left, stretched edge to edge.
        assertThat(stored.getWidth()).isEqualTo(700);
        assertThat(stored.getHeight()).isEqualTo(700);
        assertThat(colourAt(stored, 5, 350)).isEqualTo("green");
        assertThat(colourAt(stored, 695, 350)).isEqualTo("green");
        assertThat(colourAt(stored, 350, 5)).isEqualTo("green");
    }

    @Test
    void aLogoIsFittedInsideTheSquareWhole() throws IOException {
        Organisation organisation = Organisation.builder().id("Xk2pQ9rTbW").name("Acme").build();

        BufferedImage stored = savedPicture(organisation);

        // The whole strip survives, centred, with white above and below it.
        assertThat(stored.getWidth()).isEqualTo(700);
        assertThat(stored.getHeight()).isEqualTo(700);
        assertThat(colourAt(stored, 5, 350)).isEqualTo("red");
        assertThat(colourAt(stored, 350, 350)).isEqualTo("green");
        assertThat(colourAt(stored, 695, 350)).isEqualTo("blue");
        assertThat(colourAt(stored, 350, 5)).isEqualTo("white");
        assertThat(colourAt(stored, 350, 695)).isEqualTo("white");
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

    // Saves a wide red|green|blue strip for the owner and decodes the full-size picture it stored.
    private BufferedImage savedPicture(PictureOwner owner) throws IOException {
        var strip = new BufferedImage(300, 75, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = strip.createGraphics();
        Color[] thirds = {Color.RED, Color.GREEN, Color.BLUE};
        for (int i = 0; i < thirds.length; i++) {
            graphics.setColor(thirds[i]);
            graphics.fillRect(i * 100, 0, 100, 75);
        }
        graphics.dispose();
        var out = new ByteArrayOutputStream();
        ImageIO.write(strip, "png", out);

        pictureService.save(owner, new MockMultipartFile("picture", "strip.png", "image/png", out.toByteArray()));

        var picture = ArgumentCaptor.forClass(InputStream.class);
        verify(fileStorageService).upload(eq(owner.getPictureStoragePrefix() + owner.getPictureId()),
                eq("image/jpeg"), picture.capture(), anyLong());
        return ImageIO.read(picture.getValue());
    }

    // The colour a pixel is closest to. JPEG shifts exact values, so compare the channels rather than the numbers.
    private static String colourAt(BufferedImage image, int x, int y) {
        var pixel = new Color(image.getRGB(x, y));
        if (pixel.getRed() > 200 && pixel.getGreen() > 200 && pixel.getBlue() > 200) {
            return "white";
        }
        if (pixel.getRed() > pixel.getGreen() && pixel.getRed() > pixel.getBlue()) {
            return "red";
        }
        return pixel.getGreen() > pixel.getBlue() ? "green" : "blue";
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
