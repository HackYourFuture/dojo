import { useQueries, useQuery } from '@tanstack/react-query';

import { ProfileType } from '../../../data/types/ProfileType';
import { getInteractions } from '../api/api';
import { getMentorshipCheckins } from '../../mentorships/checkins/api/api';
import { interactionKeys } from './keys';
import { mapCheckinToInteraction } from '../api/mapper';
import { mentorshipCheckinKeys } from '../../mentorships/checkins/data/keys';
import { useGetAllProfileMentorships } from '../../mentorships/data/mentorship-queries';

/** Gets the interactions of a profile. The server sends the most recent first. */
export const useGetInteractions = (profileType: ProfileType, profileId: string) => {
  return useQuery({
    queryKey: interactionKeys.list(profileType, profileId),
    queryFn: () => getInteractions(profileType, profileId),
    enabled: !!profileId,
    // The tab label loads the list with the profile, so opening the tab reuses it. Changes invalidate it.
    refetchOnMount: false,
  });
};

/** Gets the interactions of a profile with the check-ins of all its mentorships, most recent first. */
export const useGetInteractionsWithCheckins = (profileType: ProfileType, profileId: string) => {
  const interactionsQuery = useGetInteractions(profileType, profileId);
  const mentorshipsQuery = useGetAllProfileMentorships(profileType, profileId);
  const mentorships = mentorshipsQuery.data?.items ?? [];
  // The same queries as the check-ins on the mentorship page, so its changes reach this list too.
  const checkinsQueries = useQueries({
    queries: mentorships.map((mentorship) => ({
      queryKey: mentorshipCheckinKeys.list(mentorship.id),
      queryFn: () => getMentorshipCheckins(mentorship.id),
      // Like the interactions, opening the tab reuses what the tab label loaded.
      refetchOnMount: false,
    })),
  });

  const isLoading =
    interactionsQuery.isLoading || mentorshipsQuery.isLoading || checkinsQueries.some((query) => query.isLoading);
  const error =
    interactionsQuery.error ?? mentorshipsQuery.error ?? checkinsQueries.find((query) => query.error)?.error ?? null;
  const checkins = checkinsQueries.flatMap((query, index) =>
    (query.data ?? []).map((checkin) => mapCheckinToInteraction(checkin, mentorships[index], profileType))
  );
  // No list while a part loads or failed, so the badge never shows a partial count.
  // A check-in is at midnight UTC, so it sorts below its day's interactions from 01:00 (02:00 in summer) on.
  const data =
    isLoading || error || !interactionsQuery.data
      ? undefined
      : [...interactionsQuery.data, ...checkins].sort((a, b) => b.date.getTime() - a.date.getTime());

  return { data, isLoading, error };
};
