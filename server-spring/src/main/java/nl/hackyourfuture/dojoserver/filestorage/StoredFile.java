package nl.hackyourfuture.dojoserver.filestorage;

import java.io.InputStream;

public record StoredFile(
        // Please close this stream after use
        InputStream content,
        String contentType,
        long contentLength
) {
}
