package nl.hackyourfuture.dojoserver.shared;

import static org.assertj.core.api.Assertions.assertThat;

import nl.hackyourfuture.dojoserver.trainee.profile.LearningStatus;
import nl.hackyourfuture.dojoserver.volunteer.VolunteerExpertise;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

class CsvTest {

    @Test
    void aFileIsAHeaderLineAndOneLinePerRowWithCrlfEnds() {
        List<Csv.Column<String>> columns = List.of(
                new Csv.Column<>("Name", name -> name),
                new Csv.Column<>("Length", name -> name.length()));

        assertThat(Csv.of(columns, List.of("Ann", "Bobby"))).isEqualTo("Name,Length\r\nAnn,3\r\nBobby,5\r\n");
    }

    @Test
    void aFieldIsQuotedOnlyWhenItHoldsACommaAQuoteOrALineBreak() {
        List<Csv.Column<String>> columns = List.of(new Csv.Column<>("Text", text -> text));
        List<String> rows = List.of("plain", "a,b", "say \"hi\"", "one\ntwo", "one\r\ntwo");

        assertThat(Csv.of(columns, rows)).isEqualTo(
                "Text\r\nplain\r\n\"a,b\"\r\n\"say \"\"hi\"\"\"\r\n\"one\ntwo\"\r\n\"one\r\ntwo\"\r\n");
    }

    @Test
    void aValueReadsAsTheProfileShowsIt() {
        assertThat(Csv.value(null)).isEmpty();
        assertThat(Csv.value(true)).isEqualTo("Yes");
        assertThat(Csv.value(false)).isEqualTo("No");
        assertThat(Csv.value(LearningStatus.ON_HOLD)).isEqualTo("On hold");
        assertThat(Csv.value(Set.of(VolunteerExpertise.HR_MENTOR, VolunteerExpertise.BACKEND)))
                .isEqualTo("Backend; Hr mentor");
        assertThat(Csv.value(Set.of())).isEmpty();
        assertThat(Csv.value(LocalDate.of(2026, 1, 5))).isEqualTo("2026-01-05");
        assertThat(Csv.value(new BigDecimal("8.25"))).isEqualTo("8.25");
        assertThat(Csv.value(42)).isEqualTo("42");
    }
}
