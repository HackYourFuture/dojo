package nl.hackyourfuture.dojoserver.shared;

import java.util.Comparator;
import java.util.List;
import java.util.function.Function;

// Scores how well a query matches a text: exactly, at the start, or somewhere inside, each with or without typos.
public final class TextMatcher {
    private static final double EXACT = 1000;
    private static final double START = 100;
    private static final double CONTAINS = 10;
    // Each typo divides the score by a hundred, so every match without typos comes first.
    private static final double TYPO = 0.01;

    private static final int MIN_QUERY_LENGTH = 2;
    private static final int MIN_CONTAINS_LENGTH = 3;
    private static final int MIN_TYPO_LENGTH = 3;
    private static final int MIN_TYPO_START_LENGTH = 4;

    private TextMatcher() {
        /* This utility class should not be instantiated */
    }

    // The items that match the query in any of their texts, best first. Equal scores go by ties.
    public static <T> List<Hit<T>> rank(List<T> items, String query, Function<? super T, List<String>> texts,
            Comparator<? super T> ties) {
        String cleanQuery = clean(query);
        return Hit.rank(items, item -> texts.apply(item).stream()
                .mapToDouble(text -> points(clean(text), cleanQuery))
                .max()
                .orElse(0), ties);
    }

    // From 1000 for an exact match down to 0 for none. Case, accents, apostrophes and dots don't count.
    public static double score(String text, String query) {
        return points(clean(text), clean(query));
    }

    // "Alphen a.d. Rijn" is "alphen a d rijn" and "'s-Gravenhage" is "s gravenhage".
    private static String clean(String text) {
        return SearchText.plain(StringUtils.withoutDots(text));
    }

    private static double points(String text, String query) {
        if (query.length() < MIN_QUERY_LENGTH) {
            return 0;
        }
        if (text.equals(query)) {
            return EXACT;
        }
        if (text.startsWith(query)) {
            return START;
        }
        // A later word may start with two letters, "ne" in "Papua New Guinea"; anywhere else takes three.
        if (text.contains(" " + query) || (query.length() >= MIN_CONTAINS_LENGTH && text.contains(query))) {
            return CONTAINS;
        }
        return query.length() >= MIN_TYPO_LENGTH ? pointsWithTypos(text, query) : 0;
    }

    // The same kinds of match, compared from the start of each word: from the first word it is the whole text or its
    // start, from a later word it only contains the query.
    private static double pointsWithTypos(String text, String query) {
        double best = 0;
        for (int start = 0; start < text.length(); start++) {
            if (start > 0 && text.charAt(start - 1) != ' ') {
                continue;
            }
            String rest = text.substring(start);
            double whole = start == 0 ? EXACT : CONTAINS;
            double part = start == 0 ? START : CONTAINS;
            best = Math.max(best, whole * similarity(query, rest, maxTypos(query, rest)));
            // Half-typed, with one typo and the right first letter: "roter" finds "Rotterdam", "omar" not "Mariam".
            if (query.length() >= MIN_TYPO_START_LENGTH && rest.charAt(0) == query.charAt(0)) {
                for (int end = query.length() - 1; end <= query.length() + 1 && end < rest.length(); end++) {
                    best = Math.max(best, part * similarity(query, rest.substring(0, end), 1));
                }
            }
        }
        return best;
    }

    // One typo per three letters of the longer text, rounded up and at most three: loose enough for transliterations
    // such as Yusuf and Youssef, which are three typos apart.
    public static int maxTypos(String query, String text) {
        return Math.min((Math.max(query.length(), text.length()) + 2) / 3, 3);
    }

    // 1 for the same spelling, less for every typo, and 0 past the most typos allowed.
    private static double similarity(String query, String text, int maxTypos) {
        // The length difference alone takes that many typos, which saves working them out.
        if (Math.abs(query.length() - text.length()) > maxTypos) {
            return 0;
        }
        int typos = StringUtils.levenshtein(query, text);
        if (typos > maxTypos) {
            return 0;
        }
        return (1 - (double) typos / Math.max(query.length(), text.length())) * Math.pow(TYPO, typos);
    }
}
