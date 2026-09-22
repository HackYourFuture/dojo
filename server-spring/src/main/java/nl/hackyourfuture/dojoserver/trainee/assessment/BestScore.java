package nl.hackyourfuture.dojoserver.trainee.assessment;

import java.math.BigDecimal;

// Projection for the grouped best-score-per-type query.
public record BestScore(String traineeId, BigDecimal bestScore) {
}
