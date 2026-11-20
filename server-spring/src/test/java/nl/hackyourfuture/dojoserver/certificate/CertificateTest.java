package nl.hackyourfuture.dojoserver.certificate;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import nl.hackyourfuture.dojoserver.filestorage.FileStorageService;
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.assertj.MockMvcTester;

import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;

/** The certificates site, without signing in. Storage is mocked because CI has no S3. */
@SpringBootTest
@AutoConfigureMockMvc
class CertificateTest {

    private static final String SITE = "/api/public/certificates";

    @Autowired
    private MockMvcTester mvc;
    @MockitoBean
    private FileStorageService fileStorageService;

    @Test
    void aCertificatePageEmbedsItsPdf() {
        when(fileStorageService.exists("certificates/Cert-1_a")).thenReturn(true);

        assertThat(mvc.get().uri(SITE + "/Cert-1_a"))
                .hasStatusOk()
                .hasContentTypeCompatibleWith(MediaType.TEXT_HTML)
                .bodyText()
                .contains("Certificate is valid", "/Cert-1_a?raw=1", "HackYourFuture-certificate-Cert-1_a.pdf")
                .doesNotContain("XXXXXXXX");
    }

    @Test
    void anUnknownCertificateGetsTheNotFoundPage() {
        assertThat(mvc.get().uri(SITE + "/UNKNOWN"))
                .hasStatus(HttpStatus.NOT_FOUND)
                .hasContentTypeCompatibleWith(MediaType.TEXT_HTML)
                .bodyText()
                .contains("could not verify");
    }

    @Test
    void thePdfCanBeEmbeddedByThePage() {
        byte[] pdf = "%PDF-1.4 certificate".getBytes(StandardCharsets.US_ASCII);
        when(fileStorageService.download("certificates/CERT1"))
                .thenReturn(new StoredFile(new ByteArrayInputStream(pdf), "binary/octet-stream", pdf.length));

        assertThat(mvc.get().uri(SITE + "/CERT1?raw=1"))
                .hasStatusOk()
                .hasContentType(MediaType.APPLICATION_PDF)
                .hasHeader("X-Frame-Options", "SAMEORIGIN")
                .body()
                .isEqualTo(pdf);
    }

    @Test
    void aMissingPdfGetsTheNotFoundPage() {
        when(fileStorageService.download("certificates/GONE")).thenThrow(new DojoNotFoundException("File not found"));

        assertThat(mvc.get().uri(SITE + "/GONE?raw=1"))
                .hasStatus(HttpStatus.NOT_FOUND)
                .hasContentTypeCompatibleWith(MediaType.TEXT_HTML)
                .bodyText()
                .contains("could not verify");
    }

    @Test
    void theSiteFilesAreServed() {
        assertThat(mvc.get().uri(SITE + "/index.css")).hasStatusOk().hasContentType("text/css");
        assertThat(mvc.get().uri(SITE + "/404.css")).hasStatusOk().hasContentType("text/css");
        assertThat(mvc.get().uri(SITE + "/HackYourFuture-logo.png")).hasStatusOk().hasContentType("image/png");
        assertThat(mvc.get().uri(SITE + "/verified-icon.svg")).hasStatusOk().hasContentType("image/svg+xml");
        assertThat(mvc.get().uri(SITE + "/robots.txt")).hasStatusOk().bodyText().contains("Disallow: /");
    }

    @Test
    void everythingElseGetsTheNotFoundPageWithoutAskingTheBucket() {
        String tooLong = "/" + "a".repeat(101);
        for (String path : new String[]{"", "/", "/index.html", "/404.html", "/favicon.ico", "/a.b", "/a~b", "/a/b",
                tooLong}) {
            assertThat(mvc.get().uri(SITE + path))
                    .hasStatus(HttpStatus.NOT_FOUND)
                    .hasContentTypeCompatibleWith(MediaType.TEXT_HTML)
                    .bodyText()
                    .contains("could not verify");
        }
        verifyNoInteractions(fileStorageService);
    }
}
