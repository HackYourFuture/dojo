package nl.hackyourfuture.dojoserver.image;

import lombok.extern.slf4j.Slf4j;
import net.coobird.thumbnailator.Thumbnails;
import net.coobird.thumbnailator.filters.Canvas;
import net.coobird.thumbnailator.geometry.Positions;
import net.coobird.thumbnailator.tasks.UnsupportedFormatException;
import nl.hackyourfuture.dojoserver.shared.exception.DojoBadRequestException;

import javax.imageio.IIOException;
import javax.imageio.ImageIO;

import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Set;

@Slf4j
public class ImageService {
    private ImageService() {
        /* This utility class should not be instantiated */
    }

    // Everything ImageIO can decode, which is what Thumbnailator reads: JPEG, PNG, GIF, BMP, WBMP, TIFF and WebP.
    public static final Set<String> SUPPORTED_CONTENT_TYPES = Set.copyOf(Arrays.asList(ImageIO.getReaderMIMETypes()));

    /** Crops the image to fill width x height, turned upright, and re-encodes it as a JPEG without metadata. */
    public static byte[] convertImage(InputStream data, int width, int height) throws IOException {
        var out = new ByteArrayOutputStream();
        try {
            Thumbnails.of(data)
                    .size(width, height)
                    .crop(Positions.CENTER)
                    .imageType(BufferedImage.TYPE_INT_ARGB) // palette images such as GIFs come out black otherwise
                    .addFilter(new Canvas(width, height, Positions.CENTER, Color.WHITE)) // white behind transparency
                    .outputFormat("jpg")
                    .outputQuality(0.9)
                    .toOutputStream(out);
        } catch (IIOException e) {
            log.error("Error converting image {}", e.getMessage());
            throw e;
        } catch (UnsupportedFormatException _) {
            throw new DojoBadRequestException("The file is not a supported image.");
        }
        return out.toByteArray();
    }
}
