import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import slackLogo from '../assets/slack.png';
import githubLogo from '../assets/github.png';
import LinkedInLogo from '../assets/LinkedIn_logo.png';
import { useTraineeInfoData } from '../hooks/useTraineeInfoData';
import { LearningStatus, ProfileSidebarProps } from '../types';
import { SidebarJobPath, SidebarLearningStatus, Loader } from '.';

export const ProfileSidebar = ({ traineeId }: ProfileSidebarProps) => {
  const { isLoading, isError, data, error, isFetching } = useTraineeInfoData(traineeId);

  const profileImgSrc = `/api/trainees/${traineeId}/profile-picture`;
  const slackId = data?.contactInfo?.slackId;
  const githubHandle = data?.contactInfo?.githubHandle;
  const linkedIn = data?.contactInfo?.linkedin;

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isError && error instanceof Error) {
    return (
      <Box p={8} sx={{ width: '100%' }}>
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          {error.message}
        </Alert>
      </Box>
    );
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
          src={profileImgSrc}
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
          {data?.personalInfo?.pronouns?.toLowerCase()}
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
          Cohort {data?.educationInfo?.currentCohort || 'Not assigned'}
        </Typography>
      </Stack>

      {/* social media contact info */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        {slackId && (
          <IconButton
            aria-label="Slack Id"
            onClick={() => window.open(`slack://user?team=TOEJTTUQ87&ID/${slackId}`)}
          >
            <img
              src={slackLogo}
              alt="Slack"
              width="32"
              height="32"
              style={{ borderRadius: '50%' }}
            />
          </IconButton>
        )}
        {githubHandle && (
          <IconButton
            aria-label="GitHub handel"
            onClick={() => window.open(`https://github.com/${githubHandle}`)}
          >
            <img
              src={githubLogo}
              alt="GitHub"
              width="32"
              height="32"
              style={{ borderRadius: '50%' }}
            />
          </IconButton>
        )}
        {linkedIn && (
          <IconButton
            aria-label="LinkedIn URL"
            onClick={() => window.open(`https://www.linkedin.com/in/${linkedIn}`)}
          >
            <img src={LinkedInLogo} alt="GitHub" width="32" height="32" />
          </IconButton>
        )}
      </div>
    </Box>
  );
};
