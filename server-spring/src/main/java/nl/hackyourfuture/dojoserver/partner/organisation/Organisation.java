package nl.hackyourfuture.dojoserver.partner.organisation;

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
@Table(name = "organisations")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@EntityListeners(AuditingEntityListener.class)
@DynamicUpdate // for PATCH
@Setter
public class Organisation implements PictureOwner {
    @Id
    @EqualsAndHashCode.Include
    @Setter(AccessLevel.NONE)
    private String id;
    private String pictureId;
    private String name;
    private String websiteUrl;
    private String linkedinUrl;
    private String location;

    @Enumerated(EnumType.STRING)
    private OrganisationStatus status;

    private String notes;

    // Managed by Spring Data JPA's AuditingEntityListener. Do not set these manually.
    @CreatedDate
    @Setter(AccessLevel.NONE)
    private Instant createdAt;

    @LastModifiedDate
    @Setter(AccessLevel.NONE)
    private Instant updatedAt;

    public String getProfilePath() {
        return String.format("/organisation/%s_%s", StringUtils.slug(name), id);
    }

    public String getPictureUrl() {
        if (getPictureId() == null) {
            return null;
        }
        return "/api/organisations/" + getId() + "/picture/" + getPictureId();
    }

    public String getThumbnailUrl() {
        if (getPictureId() == null) {
            return null;
        }
        return getPictureUrl() + "/thumbnail";
    }

    @Override
    public String getPictureStoragePrefix() {
        return "images/organisations/" + getId() + "/";
    }

    // A logo is often wide, and cropping it to a square would cut off its sides.
    @Override
    public boolean isPictureCropped() {
        return false;
    }
}
