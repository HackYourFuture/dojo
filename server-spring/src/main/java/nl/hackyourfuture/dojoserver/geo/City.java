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

// A Dutch place of residence. Reference data loaded by scripts/setup, so read-only and without audit fields.
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Builder
@Entity
@Table(name = "cities")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class City {
    // The unique name as a slug, e.g. hengelo-gelderland.
    @Id
    @EqualsAndHashCode.Include
    private String id;

    private String name;

    // Stored as a Postgres array.
    @Builder.Default
    private List<String> alternativeNames = new ArrayList<>();

    private int population;
    private String province;
    private String region;
    private double latitude;
    private double longitude;
    private Integer distanceAmsterdam;
}
