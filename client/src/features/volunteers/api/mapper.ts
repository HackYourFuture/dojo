import { CreateVolunteerRequest, UpdateVolunteerRequest, VolunteerResponse, VolunteerSummaryResponse } from './types';
import { NewVolunteer, Volunteer, VolunteerChanges, VolunteerSummary } from '../Volunteer';

import { VolunteerStatus } from '../VolunteerStatus';
import { blankFieldsToNull } from '../../../data/text';

// The fields the list item and the profile share.
const mapVolunteerFieldsToDomain = (volunteer: Omit<VolunteerSummaryResponse, 'activeMentorshipCount'>) => {
  return {
    id: volunteer.id,
    displayName: volunteer.displayName,
    profilePath: volunteer.profilePath,
    thumbnailUrl: volunteer.thumbnailUrl,
    status: volunteer.status,
    companyName: volunteer.companyName,
    jobRole: volunteer.jobRole,
    email: volunteer.email,
    githubHandle: volunteer.githubHandle,
    slackId: volunteer.slackId,
    linkedinUrl: volunteer.linkedinUrl,
    volunteerTypes: volunteer.volunteerTypes,
    expertise: volunteer.expertise,
    rolePreferences: volunteer.rolePreferences,
  };
};

export const mapVolunteerSummaryToDomain = (volunteer: VolunteerSummaryResponse): VolunteerSummary => {
  return { ...mapVolunteerFieldsToDomain(volunteer), activeMentorshipCount: volunteer.activeMentorshipCount };
};

export const mapVolunteerToDomain = (volunteer: VolunteerResponse): Volunteer => {
  return {
    ...mapVolunteerFieldsToDomain(volunteer),
    pictureUrl: volunteer.pictureUrl,
    firstName: volunteer.firstName,
    lastName: volunteer.lastName,
    gender: volunteer.gender,
    pronouns: volunteer.pronouns,
    phone: volunteer.phone,
    notes: volunteer.notes,
  };
};

export const mapDomainToUpdateVolunteerRequest = (changes: VolunteerChanges): UpdateVolunteerRequest => {
  return blankFieldsToNull<UpdateVolunteerRequest>(changes);
};

export const mapDomainToCreateVolunteerRequest = (newVolunteer: NewVolunteer): CreateVolunteerRequest => {
  return {
    firstName: newVolunteer.firstName,
    lastName: newVolunteer.lastName,
    gender: newVolunteer.gender,
    email: newVolunteer.email,
    volunteerTypes: newVolunteer.volunteerTypes,
    expertise: newVolunteer.expertise,
    rolePreferences: newVolunteer.rolePreferences,
    // A new volunteer starts as active.
    status: VolunteerStatus.Active,
  };
};
