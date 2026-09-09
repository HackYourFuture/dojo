package nl.hackyourfuture.dojoserver.shared;

import java.text.Normalizer;

public class StringUtils {
    private StringUtils() {
        /* This utility class should not be instantiated */
    }

    public static String stripAccents(String str) {
        return Normalizer.normalize(str, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    }
}
