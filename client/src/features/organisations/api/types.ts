import { EDITABLE_ORGANISATION_FIELDS, OrganisationStatus } from '../Organisation';

export interface OrganisationSummaryResponse {
  id: string;
  name: string;
  profilePath: string;
  thumbnailUrl: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  location: string | null;
  status: OrganisationStatus;
}

export interface OrganisationResponse extends OrganisationSummaryResponse {
  pictureUrl: string | null;
  notes: string | null;
}

type EditableField = (typeof EDITABLE_ORGANISATION_FIELDS)[number];

// A merge patch: every field that is sent is stored, and null clears it.
export type UpdateOrganisationRequest = { [Field in EditableField]?: OrganisationResponse[Field] | null };

export type CreateOrganisationRequest = Pick<
  OrganisationResponse,
  'name' | 'status' | 'location' | 'websiteUrl' | 'linkedinUrl'
>;
