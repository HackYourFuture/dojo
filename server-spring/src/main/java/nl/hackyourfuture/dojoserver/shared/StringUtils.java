package nl.hackyourfuture.dojoserver.shared;

import java.text.Normalizer;
import java.util.Arrays;
import java.util.Locale;
import java.util.stream.Collectors;

public class StringUtils {
    private StringUtils() {
        /* This utility class should not be instantiated */
    }

    public static String stripAccents(String str) {
        // NFD splits "ë" into "e" plus a combining mark, and \p{M} matches every combining mark, so removing
        // them leaves the plain letters.
        return Normalizer.normalize(str, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
    }

    // The text as a client route segment: its words of letters and digits, lower case and joined by dashes.
    // "Booking.com B.V." is "booking-com-b-v". It never holds an underscore, which routes put before the id.
    public static String slug(String text) {
        String[] words = stripAccents(text).toLowerCase(Locale.ROOT).split("[^\\p{L}\\p{N}]+");
        return Arrays.stream(words)
                .filter(word -> !word.isEmpty()) // a leading separator leaves an empty first word
                .collect(Collectors.joining("-"));
    }

    // The fewest single-character insertions, deletions, substitutions and swaps of two neighbouring characters that
    // turn one string into the other. https://en.wikipedia.org/wiki/Damerau%E2%80%93Levenshtein_distance
    public static int editDistance(String a, String b) {
        int[] beforePrevious = new int[b.length() + 1];
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
                // A swap, such as "teil" for "tiel", is one edit rather than two.
                if (i > 1 && j > 1 && a.charAt(i - 1) == b.charAt(j - 2) && a.charAt(i - 2) == b.charAt(j - 1)) {
                    current[j] = Math.min(current[j], beforePrevious[j - 2] + 1);
                }
            }
            int[] oldest = beforePrevious;
            beforePrevious = previous;
            previous = current;
            current = oldest;
        }
        return previous[b.length()];
    }
}
