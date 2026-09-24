package nl.hackyourfuture.dojoserver.picture;

/** An entity with a profile picture. */
public interface PictureOwner {
    String getPictureId();

    void setPictureId(String pictureId);

    // The storage folder for this owner's files, ending in a slash.
    String getPictureStoragePrefix();
}
