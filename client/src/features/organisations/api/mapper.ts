import {
  CreateOrganisationRequest,
  OrganisationResponse,
  OrganisationSummaryResponse,
  UpdateOrganisationRequest,
} from './types';
import { NewOrganisation, Organisation, OrganisationChanges, OrganisationSummary } from '../Organisation';

export const mapOrganisationSummaryToDomain = (organisation: OrganisationSummaryResponse): OrganisationSummary => {
  return {
    id: organisation.id,
    name: organisation.name,
    profilePath: organisation.profilePath,
    thumbnailUrl: organisation.thumbnailUrl,
    websiteUrl: organisation.websiteUrl,
    linkedinUrl: organisation.linkedinUrl,
    location: organisation.location,
    status: organisation.status,
  };
};

export const mapOrganisationToDomain = (organisation: OrganisationResponse): Organisation => {
  return {
    ...mapOrganisationSummaryToDomain(organisation),
    pictureUrl: organisation.pictureUrl,
    notes: organisation.notes,
  };
};

// The API rejects empty text for most fields, so an empty field is sent as null.
const isBlank = (value: unknown) => typeof value === 'string' && value.trim() === '';

export const mapDomainToUpdateOrganisationRequest = (changes: OrganisationChanges): UpdateOrganisationRequest => {
  const request: UpdateOrganisationRequest = { ...changes };

  for (const field of Object.keys(request) as (keyof UpdateOrganisationRequest)[]) {
    if (isBlank(request[field])) {
      request[field] = null;
    }
  }
  return request;
};

export const mapDomainToCreateOrganisationRequest = (newOrganisation: NewOrganisation): CreateOrganisationRequest => {
  return {
    name: newOrganisation.name,
    status: newOrganisation.status,
    location: isBlank(newOrganisation.location) ? null : newOrganisation.location,
    websiteUrl: isBlank(newOrganisation.websiteUrl) ? null : newOrganisation.websiteUrl,
    linkedinUrl: isBlank(newOrganisation.linkedinUrl) ? null : newOrganisation.linkedinUrl,
  };
};
