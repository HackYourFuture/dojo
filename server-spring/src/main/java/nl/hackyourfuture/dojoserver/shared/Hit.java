package nl.hackyourfuture.dojoserver.shared;

import java.util.Comparator;
import java.util.List;
import java.util.function.ToDoubleFunction;

// An item that matches a search, and its score.
public record Hit<T>(T item, double score) {

    // The items that score above 0, best first. Equal scores go by ties; the sort is stable.
    public static <T> List<Hit<T>> rank(List<T> items, ToDoubleFunction<? super T> score, Comparator<? super T> ties) {
        return items.stream()
                .map(item -> new Hit<>(item, score.applyAsDouble(item)))
                .filter(hit -> hit.score() > 0)
                .sorted(Comparator.<Hit<T>>comparingDouble(Hit::score).reversed().thenComparing(Hit::item, ties))
                .toList();
    }
}
