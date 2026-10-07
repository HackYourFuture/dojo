import { NewVolunteer, VolunteerChanges } from '../Volunteer';
import { createVolunteer, updateVolunteer } from '../api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

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
