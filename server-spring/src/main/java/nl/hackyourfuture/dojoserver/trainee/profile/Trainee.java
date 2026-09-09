package nl.hackyourfuture.dojoserver.trainee.profile;

import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import nl.hackyourfuture.dojoserver.shared.StringUtils;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.time.LocalDate;
import java.util.Locale;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Builder
@Entity
@Table(name = "trainees")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(AuditingEntityListener.class)
@DynamicUpdate // for PATCH
@Setter
public class Trainee {
    @Id
    @EqualsAndHashCode.Include
    @Setter(AccessLevel.NONE)
    private String id;

    // Personal
    private String imageUrl;
    private String thumbnailUrl;
    private String firstName;
    private String lastName;
    private String preferredName;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String pronouns;
    private LocalDate dateOfBirth;
    private String location;

    @Enumerated(EnumType.STRING)
    private EnglishLevel englishLevel;

    private Boolean professionalDutch;
    private String countryOfOrigin;

    @Enumerated(EnumType.STRING)
    private Background background;

    private LocalDate nlArrivalDate;
    private LocalDate firstPermitIssueDate;

    @Enumerated(EnumType.STRING)
    private FinancialSupport financialSupport;

    @Enumerated(EnumType.STRING)
    private EducationLevel educationLevel;

    private String educationBackground;
    private Integer weeklyWorkHours;
    private String dietaryPreference;
    private String healthCondition;
    private String comments;
    private String esfId;

    // Contact
    private String email;
    private String slackId;
    private String phone;
    private String githubHandle;
    private String linkedinUrl;
    private String emergencyContactName;
    private String emergencyContactRelationship;
    private String emergencyContactPhone;

    // Education
    private Integer startCohort;
    private Integer currentCohort;

    @Enumerated(EnumType.STRING)
    private Track track;

    @Enumerated(EnumType.STRING)
    private LearningStatus learningStatus;

    private LocalDate startDate;
    private LocalDate graduationDate;
    private LocalDate quitDate;

    @Enumerated(EnumType.STRING)
    private QuitReason quitReason;

    private String mentorTech;
    private String mentorHr;
    private String mentorEnglish;

    // Placement
    @Enumerated(EnumType.STRING)
    private JobPath jobPath;

    private LocalDate jobSupportEndDate;
    private Boolean hasCar;

    // Managed by Spring Data JPA's AuditingEntityListener. Do not set these manually.
    @CreatedDate
    @Setter(AccessLevel.NONE)
    private Instant createdAt;

    @LastModifiedDate
    @Setter(AccessLevel.NONE)
    private Instant updatedAt;

    // Helper methods
    public String getDisplayName() {
        String name;
        if (preferredName != null && !preferredName.isBlank()) {
            name = preferredName;
        } else {
            name = firstName;
        }
        return String.format("%s %s", name, lastName).strip();
    }

    public String getProfilePath() {
        String name = StringUtils.stripAccents(getDisplayName())
                .replaceAll("\\s+", "-")
                .toLowerCase(Locale.ROOT);
        return String.format("/trainee/%s_%s", name, id);
    }
}
