// Where the partnership with the organisation stands.
export enum OrganisationStatus {
  Active = 'active',
  Inactive = 'inactive',
  NeverEngaged = 'never-engaged',
}

export interface OrganisationSummary {
  readonly id: string;
  name: string;
  profilePath: string;
  thumbnailUrl: string | null;
  websiteUrl: string | null;
  linkedinUrl: string | null;
  location: string | null;
  status: OrganisationStatus;
}

export interface Organisation extends OrganisationSummary {
  pictureUrl: string | null;
  notes: string | null;
}

// The fields of the profile that can be edited.
export const EDITABLE_ORGANISATION_FIELDS = [
  'name',
  'status',
  'location',
  'websiteUrl',
  'linkedinUrl',
  'notes',
] as const;

export type OrganisationChanges = Partial<Pick<Organisation, (typeof EDITABLE_ORGANISATION_FIELDS)[number]>>;

// The fields of the add dialog, where the optional ones are empty text until they are filled in.
export interface NewOrganisation {
  name: string;
  status: OrganisationStatus;
  location: string;
  websiteUrl: string;
  linkedinUrl: string;
}
