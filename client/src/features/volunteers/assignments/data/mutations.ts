import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addVolunteerAssignment, deleteVolunteerAssignment, editVolunteerAssignment } from '../api/api';

import { VolunteerAssignment } from '../VolunteerAssignment';
import { volunteerAssignmentKeys } from './keys';

// Also run after a failure, which may still have changed the list, like a colleague deleting the assignment first.
// Returned, so a mutation only finishes once the list has reloaded.
const invalidateVolunteerAssignmentsQuery = (queryClient: QueryClient, volunteerId: string) => {
  return queryClient.invalidateQueries({ queryKey: volunteerAssignmentKeys.list(volunteerId) });
};

/** Hook to add an assignment to a volunteer. */
export const useAddVolunteerAssignment = (volunteerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignment: VolunteerAssignment) => addVolunteerAssignment(volunteerId, assignment),
    onSettled: () => invalidateVolunteerAssignmentsQuery(queryClient, volunteerId),
    // A failed request may still have added the assignment, so a retry could add it twice.
    retry: false,
  });
};

/** Hook to edit an assignment of a volunteer. */
export const useEditVolunteerAssignment = (volunteerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignment: VolunteerAssignment) => editVolunteerAssignment(volunteerId, assignment),
    onSettled: () => invalidateVolunteerAssignmentsQuery(queryClient, volunteerId),
  });
};

/** Hook to delete an assignment from a volunteer. */
export const useDeleteVolunteerAssignment = (volunteerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assignmentId: string) => deleteVolunteerAssignment(volunteerId, assignmentId),
    onSettled: () => invalidateVolunteerAssignmentsQuery(queryClient, volunteerId),
  });
};
