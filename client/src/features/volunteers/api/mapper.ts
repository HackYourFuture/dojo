import { CreateVolunteerRequest, UpdateVolunteerRequest, VolunteerResponse, VolunteerSummaryResponse } from './types';
import { NewVolunteer, Volunteer, VolunteerChanges, VolunteerSummary } from '../Volunteer';

import { VolunteerStatus } from '../VolunteerStatus';
import { blankFieldsToNull } from '../../../data/text';

export const mapVolunteerSummaryToDomain = (volunteer: VolunteerSummaryResponse): VolunteerSummary => {
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
  };
};

export const mapVolunteerToDomain = (volunteer: VolunteerResponse): Volunteer => {
  return {
    ...mapVolunteerSummaryToDomain(volunteer),
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
    // A new volunteer starts as active.
    status: VolunteerStatus.Active,
  };
};
