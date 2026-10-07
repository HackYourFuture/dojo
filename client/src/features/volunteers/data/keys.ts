const VOLUNTEERS_QUERY_KEY = 'volunteers';

export const volunteerKeys = {
  list: () => [VOLUNTEERS_QUERY_KEY, 'list'] as const,
  details: (volunteerId: string) => [VOLUNTEERS_QUERY_KEY, 'details', volunteerId] as const,
};
