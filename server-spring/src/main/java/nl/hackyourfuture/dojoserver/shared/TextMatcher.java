package nl.hackyourfuture.dojoserver.shared;

/**
 * How well a query matches a text, from 1 for the same text down to 0 for no match: 1 when they are equal, 0.1 when
 * the text starts with the query, 0.04 when a later word of it does, 0.01 when the text contains it, and under 0.001
 * for a close spelling, by how close. Case, accents, apostrophes and dots don't count. A name also matches without
 * its spaces, and a text over 60 characters is prose that only matches at the start of a word.
 */
public final class TextMatcher {
    private static final double EXACT = 1;
    private static final double START = 0.1;
    // "berg" in "van der Berg": well above the letters inside another word.
    private static final double WORD_START = 0.04;
    private static final double CONTAINS = 0.01;
    // Times how close the spelling is, under 1, so a close spelling comes after every match without typos.
    private static final double CLOSE_SPELLING = 0.001;

    // Inside a word or with typos, two letters match too much.
    private static final int MIN_LOOSE_LENGTH = 3;
    // Half-typed with a typo, three letters match too much.
    private static final int MIN_TYPO_START_LENGTH = 4;
    // Texts longer than a name are prose, where only word starts count: "ali" is not in every "specialization".
    private static final int MAX_NAME_LENGTH = 60;

    private TextMatcher() {
        /* This utility class should not be instantiated */
    }

    public static double score(String text, String query) {
        return points(SearchText.plain(text), SearchText.plain(query));
    }

    private static double points(String text, String query) {
        if (text.isEmpty() || query.isEmpty()) {
            return 0;
        }
        if (text.equals(query)) {
            return EXACT;
        }
        if (text.startsWith(query)) {
            return START;
        }
        if (text.contains(" " + query)) {
            return WORD_START;
        }
        return text.length() > MAX_NAME_LENGTH ? 0 : pointsInName(text, query);
    }

    // A name also matches without its spaces, "abdulrahman" is "Abdul Rahman", inside a word, and as a close spelling.
    private static double pointsInName(String text, String query) {
        String joinedText = text.replace(" ", "");
        String joinedQuery = query.replace(" ", "");
        if (joinedText.equals(joinedQuery)) {
            return EXACT;
        }
        if (joinedText.startsWith(joinedQuery)) {
            return START;
        }
        if (query.length() < MIN_LOOSE_LENGTH) {
            return 0;
        }
        if (text.contains(query)) {
            return CONTAINS;
        }
        return CLOSE_SPELLING * closeness(text, query);
    }

    // How close the query is spelled to the whole text or to any of its words, from 0 to under 1.
    private static double closeness(String text, String query) {
        double best = Math.max(similarity(text, query, maxTypos(text, query)), halfTyped(text, query));
        for (String word : text.split(" ")) {
            // Two letters match too much: "no" is not a misspelled Nour. A word of a longer name counts half, like a
            // half-typed start, so a typo in a whole name beats both.
            if (word.length() >= MIN_LOOSE_LENGTH) {
                best = Math.max(best, similarity(word, query, maxTypos(word, query)) / 2);
                best = Math.max(best, halfTyped(word, query));
            }
        }
        return best;
    }

    // Half-typed, with one typo and the right first letter: "roter" finds "Rotterdam", "omar" not "Mariam". The typo
    // may make the typed part one letter shorter or longer than the text's start. Counts half, so a typo in a whole
    // name beats one in the start of a longer name.
    private static double halfTyped(String text, String query) {
        double best = 0;
        if (query.length() >= MIN_TYPO_START_LENGTH && text.charAt(0) == query.charAt(0)) {
            for (int end = query.length() - 1; end <= query.length() + 1 && end < text.length(); end++) {
                best = Math.max(best, similarity(text.substring(0, end), query, 1));
            }
        }
        return best / 2;
    }

    // One typo per three letters of the longer text, rounded up and at most three: loose enough for transliterations
    // such as Yusuf and Youssef, which are three typos apart.
    private static int maxTypos(String text, String query) {
        return Math.min((Math.max(text.length(), query.length()) + 2) / 3, 3);
    }

    // The share of the letters that are right, halved per typo, or 0 past the most typos allowed.
    private static double similarity(String text, String query, int maxTypos) {
        // The length difference alone takes that many typos, which saves working them out.
        if (Math.abs(text.length() - query.length()) > maxTypos) {
            return 0;
        }
        int typos = StringUtils.levenshtein(text, query);
        if (typos > maxTypos) {
            return 0;
        }
        return (1 - (double) typos / Math.max(text.length(), query.length())) / Math.pow(2, typos);
    }
}
