package nl.hackyourfuture.dojoserver.slack;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import java.util.List;

class FieldChangeTest {

    private record Sample(String name, Integer count, String note) {
    }

    @Test
    void nothingChangedGivesNoChanges() {
        assertThat(FieldChange.between(new Sample("a", 1, null), new Sample("a", 1, null))).isEmpty();
    }

    @Test
    void reportsEachChangedComponentInDeclarationOrder() {
        List<FieldChange> changes = FieldChange.between(new Sample("a", 1, "x"), new Sample("b", 1, "y"));

        assertThat(changes).containsExactly(new FieldChange("name", "a", "b"), new FieldChange("note", "x", "y"));
    }

    @Test
    void aValueSetOrClearedCounts() {
        assertThat(FieldChange.between(new Sample("a", null, null), new Sample("a", 2, null)))
                .containsExactly(new FieldChange("count", null, 2));
        assertThat(FieldChange.between(new Sample("a", 2, "x"), new Sample("a", 2, null)))
                .containsExactly(new FieldChange("note", "x", null));
    }
}
