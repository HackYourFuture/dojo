import {
  CreateOrganisationRequest,
  OrganisationResponse,
  OrganisationSummaryResponse,
  UpdateOrganisationRequest,
} from './types';
import { NewOrganisation, Organisation, OrganisationChanges, OrganisationSummary } from '../Organisation';

import { blankFieldsToNull } from '../../../data/text';
import { mapCityToDomain } from '../../geo/api/mapper';

export const mapOrganisationSummaryToDomain = (organisation: OrganisationSummaryResponse): OrganisationSummary => {
  return {
    id: organisation.id,
    name: organisation.name,
    profilePath: organisation.profilePath,
    thumbnailUrl: organisation.thumbnailUrl,
    websiteUrl: organisation.websiteUrl,
    linkedinUrl: organisation.linkedinUrl,
    city: organisation.city ? mapCityToDomain(organisation.city) : null,
    status: organisation.status,
    partnershipTypes: organisation.partnershipTypes,
    responsibles: organisation.responsibles.map((responsible) => ({
      id: responsible.id,
      name: responsible.name,
      thumbnailUrl: responsible.thumbnailUrl,
    })),
  };
};

export const mapOrganisationToDomain = (organisation: OrganisationResponse): Organisation => {
  return {
    ...mapOrganisationSummaryToDomain(organisation),
    pictureUrl: organisation.pictureUrl,
    notes: organisation.notes,
  };
};

export const mapDomainToUpdateOrganisationRequest = (changes: OrganisationChanges): UpdateOrganisationRequest => {
  // The API takes the ids of the city and the responsibles, and ignores a city or responsibles field.
  const { city, responsibles, ...fields } = changes;
  const request: UpdateOrganisationRequest = { ...fields };
  if (city !== undefined) {
    request.cityId = city?.id ?? null;
  }
  if (responsibles) {
    request.responsibleIds = responsibles.map((responsible) => responsible.id);
  }

  return blankFieldsToNull(request);
};

export const mapDomainToCreateOrganisationRequest = (newOrganisation: NewOrganisation): CreateOrganisationRequest => {
  const { city, ...fields } = newOrganisation;
  return blankFieldsToNull<CreateOrganisationRequest>({ ...fields, cityId: city?.id ?? null });
};
