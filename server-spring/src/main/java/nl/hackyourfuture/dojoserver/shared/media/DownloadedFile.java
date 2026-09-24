package nl.hackyourfuture.dojoserver.shared.media;

import org.jspecify.annotations.NonNull;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;

public record DownloadedFile(String name, byte[] data, String contentType) implements MultipartFile {
    @Override
    public @NonNull String getName() {
        return name;
    }

    @Override
    public String getOriginalFilename() {
        return name;
    }

    @Override
    public String getContentType() {
        return contentType;
    }

    @Override
    public boolean isEmpty() {
        return data.length == 0;
    }

    @Override
    public long getSize() {
        return data.length;
    }

    @Override
    public byte @NonNull [] getBytes() {
        return data;
    }

    @Override
    public @NonNull InputStream getInputStream() {
        return new ByteArrayInputStream(data);
    }

    @Override
    public void transferTo(File dest) throws IOException {
        Files.write(dest.toPath(), data);
    }
}
