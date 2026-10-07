import { NewVolunteer, VolunteerChanges } from '../Volunteer';
import { createVolunteer, deleteVolunteer, updateVolunteer } from '../api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { searchKeys } from '../../search/data/keys';
import { volunteerKeys } from './keys';

/** Hook to save the edited fields of a volunteer profile. */
export const useUpdateVolunteer = (volunteerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (changes: VolunteerChanges) => updateVolunteer(volunteerId, changes),
    // The response is the saved volunteer, so the profile shows it without loading it again.
    onSuccess: (volunteer) => queryClient.setQueryData(volunteerKeys.details(volunteerId), volunteer),
  });
};

/** Hook to create a new volunteer. */
export const useCreateVolunteer = () => {
  return useMutation({
    mutationFn: (newVolunteer: NewVolunteer) => createVolunteer(newVolunteer),
    // A failed request may still have created it, and a retry would then fail on the taken email.
    retry: false,
  });
};

/** Hook to delete a volunteer with their interactions and picture. */
export const useDeleteVolunteer = (volunteerId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteVolunteer(volunteerId),
    // A retry after a lost response would fail on the volunteer that is already deleted.
    retry: false,
    // Nothing is returned, so the page does not wait for a list to reload before it leaves the profile.
    onSuccess: () => {
      // Removed instead of reset, so the profile that is still on screen does not load the deleted volunteer again.
      queryClient.removeQueries({ queryKey: volunteerKeys.details(volunteerId) });
      // Reset, so a list or search on screen reloads, like after going back while the delete ran.
      queryClient.resetQueries({ queryKey: volunteerKeys.list() });
      queryClient.resetQueries({ queryKey: searchKeys.all() });
    },
  });
};
