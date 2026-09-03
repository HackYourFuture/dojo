package nl.hackyourfuture.dojoserver.shared;

import java.security.SecureRandom;
import java.util.stream.Collectors;

public class RandomUtils {
    private static final String CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int STANDARD_ID_LENGTH = 10;

    public static String generateRandomId() {
        return generateRandomId(STANDARD_ID_LENGTH);
    }
        public static String generateRandomId(int length) {
        return RANDOM.ints(length, 0, CHARACTERS.length())
                .mapToObj(i -> String.valueOf(CHARACTERS.charAt(i)))
                .collect(Collectors.joining());
    }
}
