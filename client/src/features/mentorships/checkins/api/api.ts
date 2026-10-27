import { mapDomainToMentorshipCheckinRequest, mapMentorshipCheckinToDomain } from './mapper';

import { MentorshipCheckin } from '../MentorshipCheckin';
import { MentorshipCheckinResponse } from './types';
import axios from 'axios';

// The latest date first.
export const getMentorshipCheckins = async (mentorshipId: string) => {
  const { data } = await axios.get<MentorshipCheckinResponse[]>(`/api/mentorships/${mentorshipId}/checkins`);
  return data.map((checkin) => mapMentorshipCheckinToDomain(checkin));
};

export const addMentorshipCheckin = async (mentorshipId: string, checkin: MentorshipCheckin) => {
  const checkinRequest = mapDomainToMentorshipCheckinRequest(checkin);
  const { data } = await axios.post<MentorshipCheckinResponse>(
    `/api/mentorships/${mentorshipId}/checkins`,
    checkinRequest
  );
  return mapMentorshipCheckinToDomain(data);
};

export const editMentorshipCheckin = async (mentorshipId: string, checkin: MentorshipCheckin) => {
  const checkinRequest = mapDomainToMentorshipCheckinRequest(checkin);
  const { data } = await axios.put<MentorshipCheckinResponse>(
    `/api/mentorships/${mentorshipId}/checkins/${checkin.id}`,
    checkinRequest
  );
  return mapMentorshipCheckinToDomain(data);
};

export const deleteMentorshipCheckin = async (mentorshipId: string, checkinId: string) => {
  await axios.delete(`/api/mentorships/${mentorshipId}/checkins/${checkinId}`);
};
