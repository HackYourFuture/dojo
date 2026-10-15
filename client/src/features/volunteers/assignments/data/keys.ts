const VOLUNTEER_ASSIGNMENTS_QUERY_KEY = 'volunteerAssignments';

export const volunteerAssignmentKeys = {
  list: (volunteerId: string) => [VOLUNTEER_ASSIGNMENTS_QUERY_KEY, 'list', volunteerId] as const,
};
