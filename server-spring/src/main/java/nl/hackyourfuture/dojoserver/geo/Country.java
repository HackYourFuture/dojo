package nl.hackyourfuture.dojoserver.geo;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

// Reference data loaded by scripts/setup, so read-only and without audit fields.
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Builder
@Entity
@Table(name = "countries")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Country {
    @Id
    @EqualsAndHashCode.Include
    private String id;

    private String name;

    // Stored as a Postgres array.
    @Builder.Default
    private List<String> alternativeNames = new ArrayList<>();

    private int population;
    private String flag;
    private String code;
}
