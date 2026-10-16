import { EditableOrganisationField, OrganisationStatus, PartnershipType } from '../Organisation';

import { CityResponse } from '../../geo/api/types';

interface ResponsibleResponse {
  id: string;
  name: string;
  thumbnailUrl: string | null;
}

export interface OrganisationSummaryResponse {
  id: string;
  name: string;
  profilePath: string;
  thumbnailUrl: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  city: CityResponse | null;
  status: OrganisationStatus;
  partnershipTypes: PartnershipType[];
  responsibles: ResponsibleResponse[];
}

export interface OrganisationResponse extends OrganisationSummaryResponse {
  pictureUrl: string | null;
  notes: string | null;
}

// A merge patch: every field that is sent is stored, and null clears it. The city and the responsibles are sent as
// their ids.
export type UpdateOrganisationRequest = {
  [Field in Exclude<EditableOrganisationField, 'city' | 'responsibles'>]?: OrganisationResponse[Field] | null;
} & { cityId?: string | null; responsibleIds?: string[] | null };

export type CreateOrganisationRequest = Pick<OrganisationResponse, 'name' | 'status' | 'websiteUrl' | 'linkedinUrl'> & {
  cityId: string | null;
};
