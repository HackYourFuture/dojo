package nl.hackyourfuture.dojoserver.certificate;

import io.swagger.v3.oas.annotations.Hidden;
import lombok.extern.slf4j.Slf4j;
import nl.hackyourfuture.dojoserver.filestorage.FileStorageService;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/** The public site where anyone can check a certificate. nginx serves it on its own domain, without the prefix. */
@Hidden // A web site, not part of the API
@RestController
@RequestMapping("/api/public/certificates")
@Slf4j
public class CertificateController {
    // Letters, digits, - and _ only, so an id can't reach outside certificates/ in the bucket
    private static final String ID = "/{id:[a-zA-Z0-9_-]{1,10}}";

    private final FileStorageService fileStorageService;
    private final String validPage;
    private final String notFoundPage;

    public CertificateController(FileStorageService fileStorageService) throws IOException {
        this.fileStorageService = fileStorageService;
        this.validPage = new ClassPathResource("certificates/pages/index.html")
                .getContentAsString(StandardCharsets.UTF_8);
        this.notFoundPage =
                new ClassPathResource("certificates/pages/404.html").getContentAsString(StandardCharsets.UTF_8);
    }

    @GetMapping(ID)
    public ResponseEntity<String> page(
            @PathVariable
            String id
    ) {
        if (!fileStorageService.exists("certificates/" + id)) {
            log.info("Certificate {} not found", id);
            return notFound();
        }
        return html(HttpStatus.OK, validPage.replace("XXXXXXXX", id));
    }

    @GetMapping(path = ID, params = "raw")
    public ResponseEntity<byte[]> pdf(@PathVariable
    String id) throws IOException {
        // Read it whole first, so a slow visitor never holds a bucket connection
        try (InputStream content = fileStorageService.download("certificates/" + id).content()) {
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_PDF).body(content.readAllBytes());
        }
    }

    // The stylesheets, logo, icon and robots.txt. The page templates are in pages/, so they are never sent as they are
    @GetMapping("/{file:[a-zA-Z0-9_-]+\\.[a-z]+}")
    public ResponseEntity<Resource> file(@PathVariable
    String file) {
        var resource = new ClassPathResource("certificates/static/" + file);
        if (!resource.exists()) {
            throw new DojoNotFoundException("File not found");
        }
        // Set from the file name, or content negotiation would pick JSON
        return ResponseEntity.ok()
                .contentType(MediaTypeFactory.getMediaType(resource).orElse(MediaType.APPLICATION_OCTET_STREAM))
                .body(resource);
    }

    // Anything else, like / or /a/b
    @GetMapping("/**")
    public ResponseEntity<String> notFound() {
        return html(HttpStatus.NOT_FOUND, notFoundPage);
    }

    // A missing PDF or file gets the not-found page too, not the API's JSON error
    @ExceptionHandler(DojoNotFoundException.class)
    public ResponseEntity<String> handleNotFound() {
        return notFound();
    }

    private static ResponseEntity<String> html(HttpStatus status, String page) {
        return ResponseEntity.status(status).contentType(MediaType.TEXT_HTML).body(page);
    }
}
