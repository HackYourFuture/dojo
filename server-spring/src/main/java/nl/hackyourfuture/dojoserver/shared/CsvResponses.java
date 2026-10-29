package nl.hackyourfuture.dojoserver.shared;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;

public final class CsvResponses {
    private static final MediaType TEXT_CSV = new MediaType("text", "csv", StandardCharsets.UTF_8);
    // Excel only reads a UTF-8 file as such when it starts with the byte order mark.
    private static final String BYTE_ORDER_MARK = "\uFEFF";

    private CsvResponses() {
    }

    /** The CSV as a download named like trainees-2026-10-29.csv. */
    public static ResponseEntity<byte[]> of(String name, String csv) {
        String filename = name + "-" + LocalDate.now() + ".csv";
        return ResponseEntity.ok()
                .contentType(TEXT_CSV)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(filename).build().toString())
                .body((BYTE_ORDER_MARK + csv).getBytes(StandardCharsets.UTF_8));
    }
}
