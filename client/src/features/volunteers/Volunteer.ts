import { Gender } from '../../data/types/Person';
import { VolunteerStatus } from './VolunteerStatus';

export interface VolunteerSummary {
  readonly id: string;
  displayName: string;
  profilePath: string;
  thumbnailUrl: string | null;
  status: VolunteerStatus;
  companyName: string | null;
  jobRole: string | null;
  email: string;
  githubHandle: string | null;
  slackId: string | null;
  linkedinUrl: string | null;
}

export interface Volunteer extends VolunteerSummary {
  pictureUrl: string | null;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  pronouns: string | null;
  phone: string | null;
  notes: string | null;
}

// The fields of the profile that can be edited.
export const EDITABLE_VOLUNTEER_FIELDS = [
  'firstName',
  'lastName',
  'status',
  'gender',
  'pronouns',
  'companyName',
  'jobRole',
  'email',
  'phone',
  'slackId',
  'githubHandle',
  'linkedinUrl',
  'notes',
] as const;

export type EditableVolunteerField = (typeof EDITABLE_VOLUNTEER_FIELDS)[number];

export type VolunteerChanges = Partial<Pick<Volunteer, EditableVolunteerField>>;

// The fields of the add dialog, where the gender is null until one is picked.
export interface NewVolunteer {
  firstName: string;
  lastName: string;
  gender: Gender | null;
  email: string;
}
