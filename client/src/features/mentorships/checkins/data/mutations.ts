import { MentorshipCheckin, NewMentorshipCheckin } from '../MentorshipCheckin';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addMentorshipCheckin, deleteMentorshipCheckin, editMentorshipCheckin } from '../api/api';

import { Mentorship } from '../../Mentorship';
import { mentorshipCheckinKeys } from './keys';
import { mentorshipKeys } from '../../data/keys';
import { updateMentorship } from '../../api/api';

// Also after a failure, which may still have changed them. The mentorship and the lists reload too, as the server
// works out the last check-in from the check-ins. Returned, so a mutation only finishes once they have reloaded.
const invalidateMentorshipCheckinQueries = (queryClient: QueryClient, mentorshipId: string) => {
  return Promise.all([
    queryClient.invalidateQueries({ queryKey: mentorshipCheckinKeys.list(mentorshipId) }),
    queryClient.invalidateQueries({ queryKey: mentorshipKeys.details(mentorshipId) }),
    queryClient.invalidateQueries({ queryKey: mentorshipKeys.list() }),
  ]);
};

/** Hook to add a check-in to a mentorship, and to plan the next one by changing the mentorship's next check-in date. */
export const useAddMentorshipCheckin = (mentorship: Mentorship) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ checkin, nextCheckinDate }: NewMentorshipCheckin) => {
      // The next check-in date first: saving it again after a failure is harmless, adding the check-in again is not.
      if (nextCheckinDate?.getTime() !== mentorship.nextCheckinDate?.getTime()) {
        await updateMentorship({ ...mentorship, nextCheckinDate });
      }
      return addMentorshipCheckin(mentorship.id, checkin);
    },
    onSettled: () => invalidateMentorshipCheckinQueries(queryClient, mentorship.id),
    // A failed request may still have added the check-in, so a retry could add it twice.
    retry: false,
  });
};

/** Hook to edit a check-in of a mentorship. */
export const useEditMentorshipCheckin = (mentorshipId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checkin: MentorshipCheckin) => editMentorshipCheckin(mentorshipId, checkin),
    onSettled: () => invalidateMentorshipCheckinQueries(queryClient, mentorshipId),
  });
};

/** Hook to delete a check-in from a mentorship. */
export const useDeleteMentorshipCheckin = (mentorshipId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (checkinId: string) => deleteMentorshipCheckin(mentorshipId, checkinId),
    onSettled: () => invalidateMentorshipCheckinQueries(queryClient, mentorshipId),
    // A retry after a lost response would fail on the check-in that is already deleted.
    retry: false,
  });
};
