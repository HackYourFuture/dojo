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
    @CsvSource({"kitten, sitting, 3", "'', abc, 3", "abc, '', 3", "john, john, 0", "jhon, john, 2",
            "yusuf, youssef, 3"})
    void countsEdits(String a, String b, int edits) {
        assertThat(StringUtils.levenshtein(a, b)).isEqualTo(edits);
    }
}
