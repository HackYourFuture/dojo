package nl.hackyourfuture.dojoserver.auth.token;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, String> {

    @EntityGraph(attributePaths = "user")
    Optional<Token> findByTokenHashAndType(String tokenHash, TokenType type);

    void deleteByTokenHash(String tokenHash);

    void deleteByUserId(String userId);

    void deleteByExpiresAtBefore(Instant cutoff);
}
