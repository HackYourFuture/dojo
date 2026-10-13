package nl.hackyourfuture.dojoserver.shared;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.stream.Stream;

// Turns text into search words: lower case, no accents or apostrophes, split on anything but letters, digits and @_+,
// and on dots outside an email address.
public final class SearchText {
    private SearchText() {
        /* This utility class should not be instantiated */
    }

    public static List<String> words(String text) {
        if (text == null) {
            return List.of();
        }
        String folded = fold(StringUtils.stripAccents(text.toLowerCase(Locale.ROOT)));
        int[] codePoints = folded.codePoints().filter(c -> !isApostrophe(c)).toArray();
        StringBuilder separated = new StringBuilder(folded.length());
        for (int c : codePoints) {
            separated.appendCodePoint(Character.isLetterOrDigit(c) || isEmailCharacter(c) ? c : ' ');
        }
        return Arrays.stream(separated.toString().split(" "))
                // A dot splits, so "Coolblue B.V." is "coolblue b v", except in an email address, which stays whole.
                .flatMap(word -> word.indexOf('@') >= 0 ? Stream.of(word)
                        : Arrays.stream(word.replace('.', ' ').split(" ")))
                .map(SearchText::trimEmailCharacters)
                .filter(word -> !word.isEmpty())
                .toList();
    }

    // The words joined by single spaces: "'s-Gravendeel" is "s gravendeel" and "Åland Islands" is "aland islands".
    public static String plain(String text) {
        return String.join(" ", words(text));
    }

    // Fewer than two letters or digits in all, which would match too much to search for.
    public static boolean isTooShort(String text) {
        return words(text).stream().mapToInt(String::length).sum() < 2;
    }

    // Letters that have no accent to strip, spelled the way staff type them.
    private static String fold(String text) {
        return text.replace("ı", "i").replace("ł", "l").replace("ø", "o").replace("đ", "d")
                .replace("ß", "ss").replace("æ", "ae").replace("œ", "oe");
    }

    // Dropped rather than split on, because they sit inside transliterated names: "Ala'a" is "alaa".
    private static boolean isApostrophe(int c) {
        return switch (c) {
            case '\'', '’', '‘', 'ʼ', 'ʻ', '`', '´' -> true;
            default -> false;
        };
    }

    // Kept so an address or a handle stays one word, but trimmed off the ends: "(@omar_n)" is "omar_n" and
    // "omar@example.org." loses its dot.
    private static boolean isEmailCharacter(int c) {
        return switch (c) {
            case '@', '.', '_', '+' -> true;
            default -> false;
        };
    }

    private static String trimEmailCharacters(String word) {
        int start = 0;
        int end = word.length();
        while (start < end && isEmailCharacter(word.charAt(start))) {
            start++;
        }
        while (end > start && isEmailCharacter(word.charAt(end - 1))) {
            end--;
        }
        return word.substring(start, end);
    }
}
