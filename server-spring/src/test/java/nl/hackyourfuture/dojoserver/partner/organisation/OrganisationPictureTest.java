package nl.hackyourfuture.dojoserver.partner.organisation;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import nl.hackyourfuture.dojoserver.filestorage.FileStorageService;
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
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

/** Organisation logos over MockMvc. Storage is mocked because CI has no S3; transactional like TraineeListTest. */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser
class OrganisationPictureTest {

    private static final String CURRENT = "IMGcurrent0001";
    private static final String STALE = "IMGstale00001";

    @Autowired
    private MockMvcTester mvc;
    @Autowired
    private OrganisationRepository organisationRepository;
    @MockitoBean
    private FileStorageService fileStorageService;

    private Organisation organisation;
    private String prefix;

    @BeforeEach
    void givenAnOrganisation() {
        organisation = organisationRepository.save(Organisation.builder()
                .id(RandomUtils.generateRandomId())
                .name("Picture Test")
                .status(OrganisationStatus.ACTIVE)
                .build());
        prefix = "images/organisations/" + organisation.getId() + "/";
    }

    @Test
    void uploadReturnsThePictureAndThumbnailUrls() throws IOException {
        MvcTestResult result = mvc.put().uri("/api/organisations/{id}/picture", organisation.getId())
                .multipart()
                .file(png())
                .exchange();

        String pictureUrl = "/api/organisations/" + organisation.getId() + "/picture/" + organisation.getPictureId();
        assertThat(result).hasStatusOk();
        assertThat(result).bodyJson().extractingPath("$.pictureUrl").isEqualTo(pictureUrl);
        assertThat(result).bodyJson().extractingPath("$.thumbnailUrl").isEqualTo(pictureUrl + "/thumbnail");
        String key = prefix + organisation.getPictureId();
        verify(fileStorageService).upload(eq(key), eq("image/jpeg"), any(), anyLong());
        verify(fileStorageService).upload(eq(key + "_thumb"), eq("image/jpeg"), any(), anyLong());
    }

    @Test
    void anUploadToAnUnknownOrganisationIsNotFound() throws IOException {
        assertThat(mvc.put().uri("/api/organisations/{id}/picture", RandomUtils.generateRandomId())
                .multipart()
                .file(png()))
                .hasStatus(HttpStatus.NOT_FOUND);
        verifyNoInteractions(fileStorageService);
    }

    @Test
    void theOrganisationCarriesItsLogoUrls() {
        organisation.setPictureId(CURRENT);
        String pictureUrl = "/api/organisations/" + organisation.getId() + "/picture/" + CURRENT;

        MvcTestResult result = mvc.get().uri("/api/organisations/{id}", organisation.getId()).exchange();

        assertThat(result).bodyJson().extractingPath("$.pictureUrl").isEqualTo(pictureUrl);
        assertThat(result).bodyJson().extractingPath("$.thumbnailUrl").isEqualTo(pictureUrl + "/thumbnail");
    }

    @Test
    void thePictureAndThumbnailAreServedWithTheCacheHeader() {
        organisation.setPictureId(CURRENT);
        when(fileStorageService.download(anyString()))
                .thenAnswer(call -> new StoredFile(new ByteArrayInputStream(new byte[]{1, 2, 3}), "image/jpeg", 3));

        for (String suffix : new String[]{"", "/thumbnail"}) {
            assertThat(mvc.get().uri("/api/organisations/{id}/picture/{pictureId}" + suffix, organisation.getId(),
                    CURRENT))
                    .hasStatusOk()
                    .headers().hasValue("Cache-Control", "max-age=31536000, private, immutable");
        }
        verify(fileStorageService).download(prefix + CURRENT);
        verify(fileStorageService).download(prefix + CURRENT + "_thumb");
    }

    @Test
    void aStalePictureIdIsNotFound() {
        organisation.setPictureId(CURRENT);

        assertThat(mvc.get().uri("/api/organisations/{id}/picture/{pictureId}", organisation.getId(), STALE))
                .hasStatus(HttpStatus.NOT_FOUND);
        assertThat(mvc.delete().uri("/api/organisations/{id}/picture/{pictureId}", organisation.getId(), STALE))
                .hasStatus(HttpStatus.NOT_FOUND);
        verifyNoInteractions(fileStorageService);
    }

    @Test
    void deletingThePictureRemovesItsFiles() {
        organisation.setPictureId(CURRENT);

        assertThat(mvc.delete().uri("/api/organisations/{id}/picture/{pictureId}", organisation.getId(), CURRENT))
                .hasStatus(HttpStatus.NO_CONTENT);
        assertThat(organisation.getPictureId()).isNull();
        verify(fileStorageService).delete(prefix + CURRENT);
        verify(fileStorageService).delete(prefix + CURRENT + "_thumb");
    }

    private static MockMultipartFile png() throws IOException {
        var out = new ByteArrayOutputStream();
        ImageIO.write(new BufferedImage(40, 30, BufferedImage.TYPE_INT_RGB), "png", out);
        return new MockMultipartFile("picture", "picture.png", "image/png", out.toByteArray());
    }
}
