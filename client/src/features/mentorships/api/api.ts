import { EditedMentorship, MentorshipFilters, NewMentorship } from '../Mentorship';
import { PAGE_SIZE, PagedModel, mapPageToDomain } from '../../../data/pagination';
import {
  mapDomainToMentorshipRequest,
  mapEditedMentorshipToRequest,
  mapFiltersToQueryParams,
  mapMentorshipToDomain,
} from './mapper';

import { MentorshipResponse } from './types';
import axios from 'axios';

// The latest start date first. A filter with several values goes as type=A&type=B.
export const getMentorships = async (page: number, filters: MentorshipFilters) => {
  const { data } = await axios.get<PagedModel<MentorshipResponse>>('/api/mentorships', {
    params: { page, size: PAGE_SIZE, ...mapFiltersToQueryParams(filters) },
    paramsSerializer: { indexes: null },
  });
  return mapPageToDomain(data, mapMentorshipToDomain);
};

export const getMentorship = async (mentorshipId: string) => {
  const { data } = await axios.get<MentorshipResponse>(`/api/mentorships/${mentorshipId}`);
  return mapMentorshipToDomain(data);
};

export const createMentorship = async (newMentorship: NewMentorship) => {
  const mentorshipRequest = mapDomainToMentorshipRequest(newMentorship);
  const { data } = await axios.post<MentorshipResponse>('/api/mentorships', mentorshipRequest);
  return mapMentorshipToDomain(data);
};

// Replaces the whole mentorship, so a date that is left out is cleared.
export const updateMentorship = async (mentorship: EditedMentorship) => {
  const mentorshipRequest = mapEditedMentorshipToRequest(mentorship);
  const { data } = await axios.put<MentorshipResponse>(`/api/mentorships/${mentorship.id}`, mentorshipRequest);
  return mapMentorshipToDomain(data);
};
