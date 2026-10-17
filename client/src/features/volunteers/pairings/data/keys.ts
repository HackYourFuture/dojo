const MENTOR_PAIRINGS_QUERY_KEY = 'mentorPairings';

export const mentorPairingKeys = {
  list: (volunteerId: string) => [MENTOR_PAIRINGS_QUERY_KEY, 'list', volunteerId] as const,
};
