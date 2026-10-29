package nl.hackyourfuture.dojoserver.shared;

import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/** A CSV file as RFC 4180 has it: a header line, CRLF line ends and a field quoted only when it has to be. */
public final class Csv {
    private Csv() {
    }

    /** A column of the file: its header and how to read its value from a row. */
    public record Column<T>(String header, Function<T, Object> value) {
    }

    public static <T> String of(List<Column<T>> columns, List<T> rows) {
        var csv = new StringBuilder();
        csv.append(line(columns.stream().map(Column::header).toList()));
        for (T row : rows) {
            csv.append(line(columns.stream().map(column -> value(column.value().apply(row))).toList()));
        }
        return csv.toString();
    }

    // How a value reads in a cell: empty for null, Yes or No, "On hold" for ON_HOLD, a set as its sorted values.
    static String value(Object value) {
        return switch (value) {
            case null -> "";
            case Boolean flag -> flag ? "Yes" : "No";
            case Enum<?> constant -> StringUtils.humanize(constant);
            case Collection<?> values -> values.stream().map(Csv::value).sorted().collect(Collectors.joining("; "));
            default -> value.toString();
        };
    }

    private static String line(List<String> fields) {
        return fields.stream().map(Csv::field).collect(Collectors.joining(",")) + "\r\n";
    }

    // Quoted when it holds a comma, a quote or a line break, with its quotes doubled.
    private static String field(String value) {
        boolean needsQuotes = value.indexOf(',') >= 0 || value.indexOf('"') >= 0 || value.indexOf('\r') >= 0
                || value.indexOf('\n') >= 0;
        return needsQuotes ? "\"" + value.replace("\"", "\"\"") + "\"" : value;
    }
}
