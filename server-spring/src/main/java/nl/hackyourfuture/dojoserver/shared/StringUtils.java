package nl.hackyourfuture.dojoserver.shared;

import java.text.Normalizer;

public class StringUtils {
    private StringUtils() {
        /* This utility class should not be instantiated */
    }

    public static String stripAccents(String str) {
        // NFD splits "ë" into "e" plus a combining mark, and \p{M} matches every combining mark, so removing
        // them leaves the plain letters.
        return Normalizer.normalize(str, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    }

    // The fewest single-character insertions, deletions and substitutions that turn one string into the other.
    // https://en.wikipedia.org/wiki/Levenshtein_distance
    public static int levenshtein(String a, String b) {
        int[] previous = new int[b.length() + 1];
        int[] current = new int[b.length() + 1];
        for (int j = 0; j <= b.length(); j++) {
            previous[j] = j;
        }
        for (int i = 1; i <= a.length(); i++) {
            current[0] = i;
            for (int j = 1; j <= b.length(); j++) {
                int substitution = previous[j - 1] + (a.charAt(i - 1) == b.charAt(j - 1) ? 0 : 1);
                current[j] = Math.min(substitution, Math.min(previous[j], current[j - 1]) + 1);
            }
            int[] swap = previous;
            previous = current;
            current = swap;
        }
        return previous[b.length()];
    }
}
