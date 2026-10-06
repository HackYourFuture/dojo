package nl.hackyourfuture.dojoserver.volunteer;

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
import nl.hackyourfuture.dojoserver.picture.PictureOwner;
import nl.hackyourfuture.dojoserver.shared.StringUtils;
import nl.hackyourfuture.dojoserver.shared.model.Gender;
import org.hibernate.annotations.DynamicUpdate;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Getter
@Builder
@Entity
@Table(name = "volunteers")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(AuditingEntityListener.class)
@DynamicUpdate // for PATCH
@Setter
public class Volunteer implements PictureOwner {
    @Id
    @EqualsAndHashCode.Include
    @Setter(AccessLevel.NONE)
    private String id;

    private String pictureId;
    private String firstName;
    private String lastName;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String pronouns;
    private String companyName;
    private String jobRole;
    private String email;
    private String phone;
    private String githubHandle;
    private String slackId;
    private String linkedinUrl;

    @Enumerated(EnumType.STRING)
    private VolunteerStatus status;

    private String notes;

    // Managed by Spring Data JPA's AuditingEntityListener. Do not set these manually.
    @CreatedDate
    @Setter(AccessLevel.NONE)
    private Instant createdAt;

    @LastModifiedDate
    @Setter(AccessLevel.NONE)
    private Instant updatedAt;

    // Helper methods
    public String getDisplayName() {
        return String.format("%s %s", firstName, lastName).strip();
    }

    public String getProfilePath() {
        return String.format("/volunteer/%s_%s", StringUtils.slug(getDisplayName()), id);
    }

    public String getPictureUrl() {
        if (getPictureId() == null) {
            return null;
        }
        return "/api/volunteers/" + getId() + "/picture/" + getPictureId();
    }

    public String getThumbnailUrl() {
        if (getPictureId() == null) {
            return null;
        }
        return getPictureUrl() + "/thumbnail";
    }

    @Override
    public String getPictureStoragePrefix() {
        return "images/volunteers/" + getId() + "/";
    }
}
