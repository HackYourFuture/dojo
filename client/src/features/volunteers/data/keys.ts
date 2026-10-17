import { VolunteerFilters } from '../Volunteer';

const VOLUNTEERS_QUERY_KEY = 'volunteers';

export const volunteerKeys = {
  // Also matches every filtered list, so resetting it resets them all.
  list: () => [VOLUNTEERS_QUERY_KEY, 'list'] as const,
  filteredList: (filters: VolunteerFilters) => [VOLUNTEERS_QUERY_KEY, 'list', filters] as const,
  details: (volunteerId: string) => [VOLUNTEERS_QUERY_KEY, 'details', volunteerId] as const,
};
