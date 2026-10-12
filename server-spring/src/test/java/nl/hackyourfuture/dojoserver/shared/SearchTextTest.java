package nl.hackyourfuture.dojoserver.shared;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;

// How SearchText splits text into words, without Spring or a database.
class SearchTextTest {

    @ParameterizedTest
    @CsvSource(delimiter = '|', textBlock = """
            Zoë Müller              | zoe muller
            Yıldız                  | yildiz
            Al-Hassan O’Neil        | al hassan oneil
            Safa'a Moussa           | safaa moussa
            Asma' Al-Rifaʼi         | asma al rifai
            '  Ali    Khan  '       | ali khan
            omar_n+dojo@example.org | omar_n+dojo@example.org
            Lives in Rotterdam.     | lives in rotterdam
            (@omar_n)               | omar_n
            Łukasz Østergaard Đorđe Strauß Æsa Cœur | lukasz ostergaard dorde strauss aesa coeur
            李𠀀明 Иван مريم         | 李𠀀明 иван مريم
            """)
    void splitsTextIntoLowerCaseWordsWithoutAccents(String text, String expected) {
        assertThat(SearchText.plain(text)).isEqualTo(expected);
    }

    @Test
    void findsNoWordsInNothing() {
        assertThat(SearchText.words(null)).isEmpty();
        assertThat(SearchText.plain(null)).isEmpty();
        assertThat(SearchText.words(" - ' . ")).isEmpty();
    }
}
