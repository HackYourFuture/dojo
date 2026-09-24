package nl.hackyourfuture.dojoserver.picture;

import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.time.Duration;

public final class PictureResponses {
    // Every upload gets a new picture id, so the content behind a picture URL never changes.
    private static final CacheControl PICTURE_CACHE =
            CacheControl.maxAge(Duration.ofDays(365)).cachePrivate().immutable();

    private PictureResponses() {
    }

    /** Streams a stored picture with its type, its length and the one-year cache header. */
    public static ResponseEntity<InputStreamResource> of(StoredFile picture) {
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(picture.contentType()))
                .contentLength(picture.contentLength())
                .cacheControl(PICTURE_CACHE)
                .body(new InputStreamResource(picture.content()));
    }
}
