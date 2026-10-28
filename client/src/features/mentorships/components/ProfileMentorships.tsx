import { Box, Stack, Typography } from '@mui/material';

import { ListLoader } from '../../../components/ListLoader';
import { MentorshipPerson } from '../Mentorship';
import { MentorshipsTable } from './MentorshipsTable';
import { ProfileSection } from '../../../components/profile/ProfileSection';
import { useGetProfileMentorships } from '../data/mentorship-queries';

interface ProfileMentorshipsProps {
  profileType: MentorshipPerson;
  profileId: string;
}

/** The active and then the ended mentorships of a volunteer or a trainee, on their profile, latest start first. */
export const ProfileMentorships = ({ profileType, profileId }: ProfileMentorshipsProps) => {
  const mentorshipsQuery = useGetProfileMentorships(profileType, profileId);
  const { data } = mentorshipsQuery;
  const mentorships = data?.items ?? [];
  const activeMentorships = mentorships.filter((mentorship) => !mentorship.isEnded);
  const endedMentorships = mentorships.filter((mentorship) => mentorship.isEnded);
  // The person's own column is left out, as every row would show them.
  const showVolunteer = profileType !== 'volunteer';
  const showTrainee = profileType !== 'trainee';

  return (
    // No wider than the mentorships page. Positioned, so the first-load spinner centers here instead of on the page.
    <Box sx={{ position: 'relative', maxWidth: 1100 }}>
      <Stack spacing={4} useFlexGap>
        {activeMentorships.length > 0 && (
          <ProfileSection title={`Active mentorships (${activeMentorships.length})`}>
            <MentorshipsTable mentorships={activeMentorships} showVolunteer={showVolunteer} showTrainee={showTrainee} />
          </ProfileSection>
        )}
        {endedMentorships.length > 0 && (
          <ProfileSection title={`Ended mentorships (${endedMentorships.length})`}>
            <MentorshipsTable mentorships={endedMentorships} showVolunteer={showVolunteer} showTrainee={showTrainee} />
          </ProfileSection>
        )}
        {data && mentorships.length === 0 && (
          <ProfileSection>
            <Typography sx={{ color: 'text.secondary' }}>No mentorships yet.</Typography>
          </ProfileSection>
        )}
      </Stack>
      <ListLoader query={mentorshipsQuery} />
    </Box>
  );
};
