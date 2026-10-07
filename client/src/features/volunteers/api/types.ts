import { EditableVolunteerField } from '../Volunteer';
import { Gender } from '../../../data/types/Person';
import { VolunteerStatus } from '../VolunteerStatus';

export interface VolunteerSummaryResponse {
  id: string;
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

export interface VolunteerResponse extends VolunteerSummaryResponse {
  pictureUrl: string | null;
  firstName: string;
  lastName: string;
  gender: Gender | null;
  pronouns: string | null;
  phone: string | null;
  notes: string | null;
}

// A merge patch: every field that is sent is stored, and null clears it.
export type UpdateVolunteerRequest = {
  [Field in EditableVolunteerField]?: VolunteerResponse[Field] | null;
};

export type CreateVolunteerRequest = Pick<VolunteerResponse, 'firstName' | 'lastName' | 'gender' | 'email' | 'status'>;
