import { addDays, toISODateString, today } from '../../../data/dates';
import { Mentorship, MentorshipFilters, NewMentorship } from '../Mentorship';
import { MentorshipRequest, MentorshipResponse } from './types';

import { MentorshipStatus } from '../MentorshipStatus';

const toOptionalDate = (date: string | null) => (date ? new Date(date) : null);

const toOptionalDateString = (date: Date | null) => (date ? toISODateString(date) : null);

export const mapMentorshipToDomain = (mentorship: MentorshipResponse): Mentorship => {
  return {
    id: mentorship.id,
    volunteer: {
      id: mentorship.volunteer.id,
      name: mentorship.volunteer.name,
      profilePath: mentorship.volunteer.profilePath,
      thumbnailUrl: mentorship.volunteer.thumbnailUrl,
    },
    trainee: {
      id: mentorship.trainee.id,
      name: mentorship.trainee.name,
      profilePath: mentorship.trainee.profilePath,
      thumbnailUrl: mentorship.trainee.thumbnailUrl,
    },
    type: mentorship.type,
    startDate: new Date(mentorship.startDate),
    endDate: toOptionalDate(mentorship.endDate),
    lastCheckinDate: toOptionalDate(mentorship.lastCheckinDate),
    nextCheckinDate: toOptionalDate(mentorship.nextCheckinDate),
    daysSinceLastCheckin: mentorship.daysSinceLastCheckin,
    isEnded: mentorship.isEnded,
  };
};

export const mapDomainToMentorshipRequest = (mentorship: NewMentorship): MentorshipRequest => {
  return {
    volunteerId: mentorship.volunteerId,
    traineeId: mentorship.traineeId,
    type: mentorship.type,
    startDate: toISODateString(mentorship.startDate),
    endDate: toOptionalDateString(mentorship.endDate),
    nextCheckinDate: toOptionalDateString(mentorship.nextCheckinDate),
  };
};

// The list's query parameters. The status goes as end dates, which is how the server works out isEnded.
export const mapFiltersToQueryParams = ({ volunteerId, traineeId, type, status }: MentorshipFilters) => {
  const isActive = status.includes(MentorshipStatus.Active);
  const isEnded = status.includes(MentorshipStatus.Ended);
  return {
    volunteerId: volunteerId || undefined,
    traineeId: traineeId || undefined,
    type,
    // Active has no end date or one after today. Both statuses, or neither, filter nothing.
    endDateFrom: isActive && !isEnded ? toISODateString(addDays(today(), 1)) : undefined,
    // Ended has an end date of today or earlier.
    endDateTo: isEnded && !isActive ? toISODateString(today()) : undefined,
  };
};
