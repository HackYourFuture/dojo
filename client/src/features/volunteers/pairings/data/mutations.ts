import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addMentorPairing, deleteMentorPairing, editMentorPairing } from '../api/api';

import { MentorPairing } from '../MentorPairing';
import { mentorPairingKeys } from './keys';

// Also run after a failure, which may still have changed the list, like a colleague deleting the pairing first.
// Returned, so a mutation only finishes once the list has reloaded.
const invalidateMentorPairingsQuery = (queryClient: QueryClient, volunteerId: string) => {
  return queryClient.invalidateQueries({ queryKey: mentorPairingKeys.list(volunteerId) });
};

/** Hook to pair a volunteer with a trainee. */
export const useAddMentorPairing = (volunteerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pairing: MentorPairing) => addMentorPairing(volunteerId, pairing),
    onSettled: () => invalidateMentorPairingsQuery(queryClient, volunteerId),
    // A failed request may still have added the pairing, so a retry could add it twice.
    retry: false,
  });
};

/** Hook to edit a mentor pairing of a volunteer. */
export const useEditMentorPairing = (volunteerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pairing: MentorPairing) => editMentorPairing(volunteerId, pairing),
    onSettled: () => invalidateMentorPairingsQuery(queryClient, volunteerId),
  });
};

/** Hook to delete a mentor pairing from a volunteer. */
export const useDeleteMentorPairing = (volunteerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pairingId: string) => deleteMentorPairing(volunteerId, pairingId),
    onSettled: () => invalidateMentorPairingsQuery(queryClient, volunteerId),
  });
};
