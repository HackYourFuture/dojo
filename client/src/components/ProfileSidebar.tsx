import { Avatar, Box, IconButton, Link, Stack, Typography } from '@mui/material';
import slackLogo from '../assets/slack.png';
import githubLogo from '../assets/github.png';
import LinkedInLogo from '../assets/LinkedIn_logo.png';
import { useTraineeInfoData } from '../hooks/useTraineeInfoData';
import { LearningStatus, ProfileSidebarProps } from '../types';
import { SidebarJobPath, SidebarLearningStatus, Loader, ErrorBox } from '.';

/**
 * Component for showing profile page sidebar and sidebar data.
 *
 * @param {string} traineeId trainee id.
 * @returns {ReactNode} A React element that renders profile page sidebar information and profile image.
 */
export const ProfileSidebar = ({ traineeId }: ProfileSidebarProps) => {
  const { isLoading, isError, data, error, isFetching } = useTraineeInfoData(traineeId);

  const slackId = data?.contactInfo?.slackId;
  const githubHandle = data?.contactInfo?.githubHandle;
  const linkedIn = data?.contactInfo?.linkedin;

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return <ErrorBox errorMessage={error.message} />;
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      color="black"
      bgcolor="#d1fbe6"
      height="100vh"
      paddingX={4}
      paddingY={4}
    >
      {/* Profile image */}
      <Box height={180} width={180} display="flex" justifyContent="center">
        <Avatar
          variant="square"
          sx={{ width: '100%', height: '100%' }}
          src={data?.personalInfo?.imageUrl}
          alt={data?.displayName}
        />
      </Box>

      <Stack direction="column" spacing={1} justifyContent="center" alignItems="center">
        {/* Name */}
        <Typography variant="h6" fontWeight="bold">
          {data?.displayName}
        </Typography>
        {/* Pronouns */}
        <Typography variant="body1" color="text.secondary">
          {data?.personalInfo?.pronouns}
        </Typography>
        {/* Learning Status */}
        {data?.educationInfo?.learningStatus === LearningStatus.Graduated ? (
          <SidebarJobPath jobPath={data?.employmentInfo?.jobPath}></SidebarJobPath>
        ) : (
          <SidebarLearningStatus
            learningStatus={data?.educationInfo?.learningStatus}
          ></SidebarLearningStatus>
        )}
        {/* Cohort */}
        <Typography variant="body1" color="text.secondary">
          Cohort {data?.educationInfo?.currentCohort || 'not assigned'}
        </Typography>
      </Stack>

      {/* social media contact info */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        {slackId && (
          <Link href={`slack://user?team=T0EJTUQ87&id=${slackId}`}>
            <IconButton aria-label="Slack Id">
              <img
                src={slackLogo}
                alt="Slack"
                width="32"
                height="32"
                style={{ borderRadius: '50%' }}
              />
            </IconButton>
          </Link>
        )}
        {githubHandle && (
          <Link
            href={`https://github.com/${githubHandle}`}
            target="_blank"
            rel="noopener"
          >
            <IconButton aria-label="GitHub handel">
              <img
                src={githubLogo}
                alt="GitHub"
                width="32"
                height="32"
                style={{ borderRadius: '50%' }}
              />
            </IconButton>
          </Link>
        )}
        {linkedIn && (
          <Link href={linkedIn} target="_blank" rel="noopener">
            <IconButton aria-label="LinkedIn URL">
              <img src={LinkedInLogo} alt="LinkedIn" width="32" height="32" />
            </IconButton>
          </Link>
        )}
      </div>
    </Box>
  );
};
