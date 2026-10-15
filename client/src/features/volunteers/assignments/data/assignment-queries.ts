import { getVolunteerAssignments } from '../api/api';
import { useQuery } from '@tanstack/react-query';
import { volunteerAssignmentKeys } from './keys';

/** Hook to get the assignments of a volunteer, the latest start date first. */
export const useGetVolunteerAssignments = (volunteerId: string) => {
  return useQuery({
    queryKey: volunteerAssignmentKeys.list(volunteerId),
    queryFn: () => getVolunteerAssignments(volunteerId),
  });
};
