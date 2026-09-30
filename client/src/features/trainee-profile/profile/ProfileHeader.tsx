import { Avatar, Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { EditableProfilePicture } from '../../profile-picture/components/EditableProfilePicture';
import GitHubIcon from '@mui/icons-material/GitHub';
import { LearningStatus } from '../../../data/types/Trainee';
import LinkedInLogo from '../../../assets/LinkedIn_logo.png';
import { ReactNode } from 'react';
import { SidebarJobPath } from '../../../components/SidebarJobPath';
import { SidebarLearningStatus } from '../../../components/SidebarLearningStatus';
import { getSlackUserUrl } from '../../../data/links';
import slackLogo from '../../../assets/slack.png';
import { useGetTrainee } from '../data/trainee-queries';

// About as tall as the three rows of text next to the picture.
const PICTURE_SIZE = 96;
const SOCIAL_ICON_SIZE = 20;

interface ProfileHeaderProps {
  traineeId: string;
}

interface SocialLinkProps {
  title: string;
  href: string;
  icon: ReactNode;
  isExternal?: boolean;
}

const SocialLink = ({ title, href, icon, isExternal = false }: SocialLinkProps) => (
  <Tooltip title={title}>
    <IconButton
      component="a"
      size="small"
      href={href}
      aria-label={title}
      {...(isExternal && { target: '_blank', rel: 'noopener' })}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

/**
 * Component for showing the trainee's picture, name, cohort, status and social links above the profile tabs.
 *
 * @param {string} traineeId trainee id.
 */
const ProfileHeader = ({ traineeId }: ProfileHeaderProps) => {
  const { data } = useGetTrainee(traineeId);

  const pronouns = data?.personalInfo?.pronouns;
  const slackId = data?.contactInfo?.slackId;
  const githubHandle = data?.contactInfo?.githubHandle;
  const linkedIn = data?.contactInfo?.linkedinUrl;

  return (
    <Box display="flex" alignItems="center" gap={3}>
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
      <Stack spacing={1} useFlexGap minWidth={0}>
        <Box display="flex" alignItems="baseline" flexWrap="wrap" columnGap={1.5}>
          <Typography variant="h5" component="h1" fontWeight={600}>
            {data?.displayName}
          </Typography>
          {pronouns && <Typography color="text.secondary">{pronouns}</Typography>}
        </Box>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1.5}>
          {data?.educationInfo?.learningStatus === LearningStatus.Graduated ? (
            <SidebarJobPath jobPath={data?.employmentInfo?.jobPath}></SidebarJobPath>
          ) : (
            <SidebarLearningStatus learningStatus={data?.educationInfo?.learningStatus}></SidebarLearningStatus>
          )}
          <Typography variant="body2" color="text.secondary">
            Cohort {data?.educationInfo?.currentCohort ?? 'not assigned'}
          </Typography>
        </Box>
        {(slackId || githubHandle || linkedIn) && (
          // Pulled left by the button padding, so the logos line up with the text above.
          <Stack direction="row" spacing={0.5} sx={{ ml: '-5px' }}>
            {slackId && (
              <SocialLink
                title="Slack"
                href={getSlackUserUrl(slackId)}
                icon={
                  <Box
                    component="img"
                    src={slackLogo}
                    alt=""
                    width={SOCIAL_ICON_SIZE}
                    height={SOCIAL_ICON_SIZE}
                    borderRadius="50%"
                  />
                }
              />
            )}
            {githubHandle && (
              <SocialLink
                title="GitHub"
                href={`https://github.com/${githubHandle}`}
                icon={<GitHubIcon sx={{ color: 'action.active', fontSize: SOCIAL_ICON_SIZE }} />}
                isExternal
              />
            )}
            {linkedIn && (
              <SocialLink
                title="LinkedIn"
                href={linkedIn}
                icon={
                  <Box component="img" src={LinkedInLogo} alt="" width={SOCIAL_ICON_SIZE} height={SOCIAL_ICON_SIZE} />
                }
                isExternal
              />
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ProfileHeader;
