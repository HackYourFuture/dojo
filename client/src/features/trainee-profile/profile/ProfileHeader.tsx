import { Avatar, Box, Stack, Typography } from '@mui/material';

import { EditableProfilePicture } from '../../profile-picture/components/EditableProfilePicture';
import { LearningStatus } from '../../../data/types/Trainee';
import { ReactNode } from 'react';
import { SidebarJobPath } from '../../../components/SidebarJobPath';
import { SidebarLearningStatus } from '../../../components/SidebarLearningStatus';
import { SocialLinks } from '../../../components/profile/SocialLinks';
import { useGetTrainee } from '../data/trainee-queries';

// About as tall as the three rows of text next to the picture.
const PICTURE_SIZE = 96;

interface ProfileHeaderProps {
  traineeId: string;
  // The Edit and Actions buttons, at the top right.
  children: ReactNode;
}

/**
 * Component for showing the trainee's picture, name, cohort, status and social links above the profile tabs.
 *
 * @param {string} traineeId trainee id.
 */
const ProfileHeader = ({ traineeId, children }: ProfileHeaderProps) => {
  const { data } = useGetTrainee(traineeId);

  const pronouns = data?.personalInfo?.pronouns;
  const slackId = data?.contactInfo?.slackId;
  const githubHandle = data?.contactInfo?.githubHandle;
  const linkedIn = data?.contactInfo?.linkedinUrl;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <EditableProfilePicture
        profileType="trainee"
        profileId={traineeId}
        pictureUrl={data?.pictureUrl ?? null}
        variant="circular"
      >
        <Avatar
          src={data?.pictureUrl ?? undefined}
          alt={data?.displayName}
          sx={{ width: PICTURE_SIZE, height: PICTURE_SIZE }}
        />
      </EditableProfilePicture>

      {/* Spaced with a gap instead of margins, which would override the social links offset. */}
      <Stack spacing={1} useFlexGap sx={{ minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 1.5 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            {data?.displayName}
          </Typography>
          {pronouns && <Typography sx={{ color: 'text.secondary' }}>{pronouns}</Typography>}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          {data?.educationInfo?.learningStatus === LearningStatus.Graduated ? (
            <SidebarJobPath jobPath={data?.employmentInfo?.jobPath}></SidebarJobPath>
          ) : (
            <SidebarLearningStatus learningStatus={data?.educationInfo?.learningStatus}></SidebarLearningStatus>
          )}
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Cohort {data?.educationInfo?.currentCohort ?? 'not assigned'}
          </Typography>
        </Box>
        <SocialLinks slackId={slackId} githubHandle={githubHandle} linkedinUrl={linkedIn} />
      </Stack>

      <Box sx={{ marginLeft: 'auto', alignSelf: 'flex-start', flexShrink: 0 }}>{children}</Box>
    </Box>
  );
};

export default ProfileHeader;
