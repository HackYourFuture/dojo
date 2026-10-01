// Where the partnership with the organisation stands.
export enum OrganisationStatus {
  Active = 'active',
  Inactive = 'inactive',
  NeverEngaged = 'never-engaged',
}

// What the organisation can offer HYF.
export enum PartnershipType {
  Volunteer = 'volunteer',
  Funding = 'funding',
  Employment = 'employment',
  Events = 'events',
}

// A user responsible for the organisation.
export interface Responsible {
  readonly id: string;
  name: string;
  thumbnailUrl: string | null;
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
  partnershipTypes: PartnershipType[];
  // The primary responsible comes first.
  responsibles: Responsible[];
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
  'partnershipTypes',
  'responsibles',
  'notes',
] as const;

export type EditableOrganisationField = (typeof EDITABLE_ORGANISATION_FIELDS)[number];

export type OrganisationChanges = Partial<Pick<Organisation, EditableOrganisationField>>;

// The fields of the add dialog, where the optional ones are empty text until they are filled in.
export interface NewOrganisation {
  name: string;
  status: OrganisationStatus;
  location: string;
  websiteUrl: string;
  linkedinUrl: string;
}
