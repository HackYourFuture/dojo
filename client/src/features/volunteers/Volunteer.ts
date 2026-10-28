import { Gender } from '../../data/types/Person';
import { VolunteerAssignmentType } from './VolunteerAssignmentType';
import { VolunteerExpertise } from './VolunteerExpertise';
import { VolunteerStatus } from './VolunteerStatus';
import { VolunteerType } from './VolunteerType';

// The filters of the volunteers list, named as in its URL and the API.
export interface VolunteerFilters {
  q: string;
  status: string[];
  type: string[];
  expertise: string[];
  rolePreference: string[];
  paired: string[];
}

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
  volunteerTypes: VolunteerType[];
  expertise: VolunteerExpertise[];
  rolePreferences: VolunteerAssignmentType[];
  activeMentorshipCount: number;
}

// Without the active mentorship count, which the API only works out for the list.
export interface Volunteer extends Omit<VolunteerSummary, 'activeMentorshipCount'> {
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
  'volunteerTypes',
  'expertise',
  'rolePreferences',
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
  volunteerTypes: VolunteerType[];
  expertise: VolunteerExpertise[];
  rolePreferences: VolunteerAssignmentType[];
}

// A volunteer as another record refers to them, like the mentor of a mentorship.
export interface VolunteerReference {
  readonly id: string;
  name: string;
  profilePath: string;
  thumbnailUrl: string | null;
}
