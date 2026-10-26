import { MentorshipFilters } from '../Mentorship';

const MENTORSHIPS_QUERY_KEY = 'mentorships';

export const mentorshipKeys = {
  // Also matches every filtered list, so invalidating it reloads them all.
  list: () => [MENTORSHIPS_QUERY_KEY, 'list'] as const,
  filteredList: (filters: MentorshipFilters) => [MENTORSHIPS_QUERY_KEY, 'list', filters] as const,
};
