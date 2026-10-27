import { MentorshipCheckinRequest, MentorshipCheckinResponse } from './types';

import { MentorshipCheckin } from '../MentorshipCheckin';
import { toISODateString } from '../../../../data/dates';

export const mapMentorshipCheckinToDomain = (checkin: MentorshipCheckinResponse): MentorshipCheckin => {
  return {
    id: checkin.id,
    date: new Date(checkin.date),
    notes: checkin.notes,
  };
};

// The notes are required and the dialog refuses blank ones, so nothing goes to null.
export const mapDomainToMentorshipCheckinRequest = (checkin: MentorshipCheckin): MentorshipCheckinRequest => {
  return {
    date: toISODateString(checkin.date),
    notes: checkin.notes,
  };
};
