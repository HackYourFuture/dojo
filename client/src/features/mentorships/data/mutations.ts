import { useMutation, useQueryClient } from '@tanstack/react-query';

import { NewMentorship } from '../Mentorship';
import { createMentorship } from '../api/api';
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
