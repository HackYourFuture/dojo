package nl.hackyourfuture.dojoserver.geo;

import java.util.List;
import java.util.stream.Stream;

// A city or a country, as the geo search sees it.
interface Place {
    String getId();

    String getName();

    List<String> getAlternativeNames();

    int getPopulation();

    // The name and every alternative name, which the search treats the same.
    default List<String> names() {
        return Stream.concat(Stream.of(getName()), getAlternativeNames().stream()).toList();
    }
}
