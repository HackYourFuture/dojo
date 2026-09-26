package nl.hackyourfuture.dojoserver.search;

import nl.hackyourfuture.dojoserver.shared.StringUtils;

import java.util.List;
import java.util.stream.Stream;

/**
 * Scores how well the words of a query match the fields of one record. Each word must match some field and counts
 * once, at its best match: the kind of match times the field's weight. Kinds of match are ten times apart, so a better
 * kind beats a better field while the heaviest weight stays under ten times the lightest.
 */
final class SearchMatcher {
    private static final double WHOLE_WORD = 1000;
    private static final double WORD_START = 100;
    private static final double CLOSE_SPELLING = 10;
    private static final double INSIDE_WORD = 1;

    private static final int MIN_QUERY_LENGTH = 2;
    private static final int MIN_CLOSE_SPELLING_LENGTH = 3;
    private static final int MIN_INSIDE_WORD_LENGTH = 4;

    private SearchMatcher() {
        /* This utility class should not be instantiated */
    }

    // A field's search words and weight. Names also match close spellings and parts of longer words.
    record Field(List<String> words, double weight, boolean isName) {
        static Field name(String value, double weight) {
            return new Field(wordsOf(value), weight, true);
        }

        static Field text(String value, double weight) {
            return new Field(wordsOf(value), weight, false);
        }
    }

    // The distinct words of a query, or none when it has fewer than two letters or digits.
    static List<String> tokenize(String query) {
        List<String> words = SearchText.words(query);
        if (words.stream().mapToInt(String::length).sum() < MIN_QUERY_LENGTH) {
            return List.of();
        }
        return words.stream().distinct().toList();
    }

    static double score(List<String> tokens, List<Field> fields) {
        return Math.max(scoreEachWord(tokens, fields), scoreJoined(tokens, fields));
    }

    // The value's words, plus the whole value without spaces so that "abdulrahman" matches "Abdul Rahman".
    private static List<String> wordsOf(String value) {
        List<String> words = SearchText.words(value);
        if (words.size() < 2) {
            return words;
        }
        return Stream.concat(words.stream(), Stream.of(String.join("", words))).toList();
    }

    private static double scoreEachWord(List<String> tokens, List<Field> fields) {
        double total = 0;
        for (String token : tokens) {
            double best = fields.stream().mapToDouble(field -> field.weight() * points(token, field)).max().orElse(0);
            if (best == 0) {
                return 0;
            }
            total += best;
        }
        return total;
    }

    // The other way round from wordsOf: "abdul rahman" finds "Abdulrahman" by joining the query words into one
    // whole word, worth what the separate words would have scored. Only whole words count, so joining never loosens
    // a query: "mariam h" does not match "Mariam".
    private static double scoreJoined(List<String> tokens, List<Field> fields) {
        String joined = String.join("", tokens);
        double best = fields.stream()
                .filter(field -> field.words().contains(joined))
                .mapToDouble(field -> field.weight() * WHOLE_WORD)
                .max()
                .orElse(0);
        return tokens.size() * best;
    }

    private static double points(String token, Field field) {
        List<String> words = field.words();
        if (words.contains(token)) {
            return WHOLE_WORD;
        }
        if (words.stream().anyMatch(word -> word.startsWith(token))) {
            return WORD_START;
        }
        if (!field.isName()) {
            return 0;
        }
        double closeness = closeness(token, words);
        if (closeness > 0) {
            return CLOSE_SPELLING * closeness;
        }
        if (token.length() >= MIN_INSIDE_WORD_LENGTH && words.stream().anyMatch(word -> word.contains(token))) {
            return INSIDE_WORD;
        }
        return 0;
    }

    // How close the nearest word is spelled, from 0 to 1. The edit budget is one edit per three letters of the longer
    // word, rounded up and at most three: loose enough for transliterations such as Yusuf and Youssef, which are
    // three edits apart.
    private static double closeness(String token, List<String> words) {
        if (token.length() < MIN_CLOSE_SPELLING_LENGTH) {
            return 0;
        }
        double best = 0;
        for (String word : words) {
            int length = Math.max(token.length(), word.length());
            int edits = StringUtils.levenshtein(token, word);
            if (edits <= Math.min((length + 2) / 3, 3)) {
                best = Math.max(best, 1 - (double) edits / length);
            }
        }
        return best;
    }
}
