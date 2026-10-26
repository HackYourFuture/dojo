import { useMutation, useQueryClient } from '@tanstack/react-query';

import { EditedMentorship, NewMentorship } from '../Mentorship';
import { createMentorship, updateMentorship } from '../api/api';

import { mentorshipKeys } from './keys';

/** Hook to pair a volunteer with a trainee. */
export const useCreateMentorship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newMentorship: NewMentorship) => createMentorship(newMentorship),
    // Also after a failure, which may still have added it. Returned, so the mutation only ends once the list reloaded.
    onSettled: () => queryClient.invalidateQueries({ queryKey: mentorshipKeys.list() }),
    // A failed request may still have added the mentorship, so a retry could add it twice.
    retry: false,
  });
};

/** Hook to save the edited mentorship. The API replaces the whole mentorship, so every field is sent. */
export const useUpdateMentorship = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mentorship: EditedMentorship) => updateMentorship(mentorship),
    // The response is the saved mentorship, so the profile shows it without loading it again.
    onSuccess: (mentorship) => queryClient.setQueryData(mentorshipKeys.details(mentorship.id), mentorship),
  });
};
