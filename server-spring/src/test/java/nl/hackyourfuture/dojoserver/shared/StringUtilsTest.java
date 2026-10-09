package nl.hackyourfuture.dojoserver.shared;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

class StringUtilsTest {

    @ParameterizedTest
    @CsvSource(delimiter = '|', textBlock = """
            Zoë Müller    | Zoe Muller
            Saïd Chérif   | Said Cherif
            Ñúñez Ålvarez | Nunez Alvarez
            Łukasz        | Łukasz
            Иван          | Иван
            李𠀀明         | 李𠀀明
            ''            | ''
            """)
    void stripsAccentsButLeavesOtherLettersAlone(String text, String expected) {
        assertThat(StringUtils.stripAccents(text)).isEqualTo(expected);
    }

    @ParameterizedTest
    @CsvSource(delimiter = '|', textBlock = """
            Booking.com B.V.         | booking-com-b-v
            ' Zoë & Müller / Co. '   | zoe-muller-co
            ABN AMRO                 | abn-amro
            Tech_Hub_NL              | tech-hub-nl
            '(Café) 42?#'            | cafe-42
            Иван                     | иван
            '李𠀀明 & Co'              | 李𠀀明-co
            '--'                     | ''
            """)
    void slugsKeepLettersAndDigitsJoinedByOneDash(String text, String expected) {
        assertThat(StringUtils.slug(text)).isEqualTo(expected);
    }

    @ParameterizedTest
    @CsvSource({"kitten, sitting, 3", "'', abc, 3", "abc, '', 3", "john, john, 0", "jhon, john, 1",
            "yusuf, youssef, 3", "sapin, spain, 1", "ab, ba, 1"})
    void countsEdits(String a, String b, int edits) {
        assertThat(StringUtils.editDistance(a, b)).isEqualTo(edits);
    }
}
