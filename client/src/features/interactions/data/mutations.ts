import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addInteraction, deleteInteraction, editInteraction } from '../api/api';

import { Interaction } from '../Interaction';
import { ProfileType } from '../../../data/types/ProfileType';
import { interactionKeys } from './keys';

// Also run after a failure, which may still have changed the list, like a colleague deleting the interaction first.
// Returned, so a mutation only finishes once the list has reloaded.
const invalidateInteractionsQuery = (queryClient: QueryClient, profileType: ProfileType, profileId: string) => {
  return queryClient.invalidateQueries({ queryKey: interactionKeys.list(profileType, profileId) });
};

/** Hook to add an interaction to a trainee or an organisation. */
export const useAddInteraction = (profileType: ProfileType, profileId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interaction: Interaction) => addInteraction(profileType, profileId, interaction),
    onSettled: () => invalidateInteractionsQuery(queryClient, profileType, profileId),
    // A failed request may still have added the interaction, so a retry could add it twice.
    retry: false,
  });
};

/** Hook to edit an existing interaction of a trainee or an organisation. */
export const useEditInteraction = (profileType: ProfileType, profileId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interaction: Interaction) => editInteraction(profileType, profileId, interaction),
    onSettled: () => invalidateInteractionsQuery(queryClient, profileType, profileId),
  });
};

/** Hook to delete an interaction from a trainee or an organisation. */
export const useDeleteInteraction = (profileType: ProfileType, profileId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (interactionId: string) => deleteInteraction(profileType, profileId, interactionId),
    onSettled: () => invalidateInteractionsQuery(queryClient, profileType, profileId),
  });
};
