import { NewVolunteer, VolunteerChanges, VolunteerFilters } from '../Volunteer';
import { PAGE_SIZE, PagedModel, mapPageToDomain } from '../../../data/pagination';
import { VolunteerResponse, VolunteerSummaryResponse } from './types';
import {
  mapDomainToCreateVolunteerRequest,
  mapDomainToUpdateVolunteerRequest,
  mapVolunteerSummaryToDomain,
  mapVolunteerToDomain,
} from './mapper';

import axios from 'axios';

// Sorted by first name, from A to Z. A filter with several values goes as status=A&status=B.
export const getVolunteerSummaries = async (page: number, filters: VolunteerFilters) => {
  const { data } = await axios.get<PagedModel<VolunteerSummaryResponse>>('/api/volunteers', {
    params: { page, size: PAGE_SIZE, ...filters, q: filters.q || undefined },
    paramsSerializer: { indexes: null },
  });
  return mapPageToDomain(data, mapVolunteerSummaryToDomain);
};

export const getVolunteer = async (volunteerId: string) => {
  const { data } = await axios.get<VolunteerResponse>(`/api/volunteers/${volunteerId}`);
  return mapVolunteerToDomain(data);
};

export const updateVolunteer = async (volunteerId: string, changes: VolunteerChanges) => {
  const volunteerRequest = mapDomainToUpdateVolunteerRequest(changes);
  const { data } = await axios.patch<VolunteerResponse>(`/api/volunteers/${volunteerId}`, volunteerRequest);
  return mapVolunteerToDomain(data);
};

export const createVolunteer = async (newVolunteer: NewVolunteer) => {
  const volunteerRequest = mapDomainToCreateVolunteerRequest(newVolunteer);
  const { data } = await axios.post<VolunteerResponse>('/api/volunteers', volunteerRequest);
  return mapVolunteerToDomain(data);
};

export const deleteVolunteer = async (volunteerId: string) => {
  await axios.delete(`/api/volunteers/${volunteerId}`);
};

// The volunteers the search finds for the text, by first name. Only the first page, for a picker.
export const searchVolunteers = async (query: string) => {
  const { data } = await axios.get<PagedModel<VolunteerSummaryResponse>>('/api/volunteers', {
    params: { q: query, size: 100 },
  });
  return data.content.map(mapVolunteerSummaryToDomain);
};
