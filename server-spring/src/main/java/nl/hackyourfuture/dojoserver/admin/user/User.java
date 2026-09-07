package nl.hackyourfuture.dojoserver.admin.user;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Builder
@Entity
@Table(name = "users")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(AuditingEntityListener.class)
@Setter
public class User {
    @Id
    @EqualsAndHashCode.Include
    @Setter(AccessLevel.NONE)
    private String id;

    private String email;
    private String name;
    private String imageUrl;
    private boolean isActive;

    // Managed by Spring Data JPA's AuditingEntityListener. Do not set these manually.
    @CreatedDate
    @Setter(AccessLevel.NONE)
    private Instant createdAt;

    @LastModifiedDate
    @Setter(AccessLevel.NONE)
    private Instant updatedAt;
}
