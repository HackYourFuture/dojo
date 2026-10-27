const MENTORSHIP_CHECKINS_QUERY_KEY = 'mentorshipCheckins';

export const mentorshipCheckinKeys = {
  list: (mentorshipId: string) => [MENTORSHIP_CHECKINS_QUERY_KEY, 'list', mentorshipId] as const,
};
