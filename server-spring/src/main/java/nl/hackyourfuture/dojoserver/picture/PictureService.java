package nl.hackyourfuture.dojoserver.picture;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.hackyourfuture.dojoserver.filestorage.FileStorageService;
import nl.hackyourfuture.dojoserver.filestorage.StoredFile;
import nl.hackyourfuture.dojoserver.shared.RandomUtils;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoNotFoundException;
import nl.hackyourfuture.dojoserver.shared.media.ImageEditor;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;

@Slf4j
@Service
@RequiredArgsConstructor
public class PictureService {
    private static final int PICTURE_SIZE = 700;
    private static final int THUMBNAIL_SIZE = 70;

    private final FileStorageService fileStorageService;

    public StoredFile download(PictureOwner owner, String pictureId) {
        requireCurrent(owner, pictureId, "Picture");
        return fileStorageService.download(pictureKey(owner, owner.getPictureId()));
    }

    public StoredFile downloadThumbnail(PictureOwner owner, String pictureId) {
        requireCurrent(owner, pictureId, "Thumbnail");
        return fileStorageService.download(thumbnailKey(owner, owner.getPictureId()));
    }

    /** Stores the file as the owner's new picture and thumbnail, then deletes the old ones. */
    public void save(PictureOwner owner, MultipartFile file) {
        if (file.isEmpty()) {
            throw new DojoBadRequestException("The picture file is empty.");
        }
        if (file.getContentType() == null || !ImageEditor.SUPPORTED_CONTENT_TYPES.contains(file.getContentType())) {
            throw new DojoBadRequestException("The picture must be a JPEG, PNG, GIF, BMP, TIFF or WebP image.");
        }
        // Convert both before uploading either, so a broken image leaves nothing behind.
        byte[] pictureJpeg = convert(file, PICTURE_SIZE);
        byte[] thumbnailJpeg = convert(file, THUMBNAIL_SIZE);

        // Do the upload
        String oldPictureId = owner.getPictureId();
        String newPictureId = "IMG" + RandomUtils.generateRandomId(10);
        String pictureKey = pictureKey(owner, newPictureId);
        String thumbnailKey = thumbnailKey(owner, newPictureId);
        var pictureStream = new ByteArrayInputStream(pictureJpeg);
        var thumbnailStream = new ByteArrayInputStream(thumbnailJpeg);
        fileStorageService.upload(pictureKey, MediaType.IMAGE_JPEG_VALUE, pictureStream, pictureJpeg.length);
        fileStorageService.upload(thumbnailKey, MediaType.IMAGE_JPEG_VALUE, thumbnailStream, thumbnailJpeg.length);

        // Save the picture id in the database
        owner.setPictureId(newPictureId);

        // Remove any older pictureID
        if (oldPictureId != null) {
            deleteQuietly(owner, oldPictureId);
        }
    }

    public void delete(PictureOwner owner, String pictureId) {
        requireCurrent(owner, pictureId, "Picture");
        deleteQuietly(owner, owner.getPictureId());
        owner.setPictureId(null);
    }

    // Everything under the owner's prefix, leftovers included. Throws, so the caller's delete rolls back.
    public void deleteAll(PictureOwner owner) {
        fileStorageService.deleteAllWithPrefix(owner.getPictureStoragePrefix());
    }

    private static void requireCurrent(PictureOwner owner, String pictureId, String label) {
        if (!pictureId.strip().equals(owner.getPictureId())) {
            throw new DojoNotFoundException(label, pictureId);
        }
    }

    private static byte[] convert(MultipartFile file, int size) {
        try (InputStream data = file.getInputStream()) {
            return ImageEditor.convertImage(data, size, size);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    // Best effort: anything left behind is swept by deleteAll when the owner is deleted.
    private void deleteQuietly(PictureOwner owner, String pictureId) {
        try {
            fileStorageService.delete(pictureKey(owner, pictureId));
            fileStorageService.delete(thumbnailKey(owner, pictureId));
        } catch (RuntimeException e) {
            log.error("Could not delete picture {}{}: {}", owner.getPictureStoragePrefix(), pictureId, e.getMessage());
        }
    }

    private static String pictureKey(PictureOwner owner, String pictureId) {
        return owner.getPictureStoragePrefix() + pictureId;
    }

    private static String thumbnailKey(PictureOwner owner, String pictureId) {
        return pictureKey(owner, pictureId) + "_thumb";
    }
}
