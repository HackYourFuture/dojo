import { Box, IconButton, Link, Modal, Stack, Typography } from '@mui/material';
import { SidebarJobPath, SidebarLearningStatus } from '.';

import { LearningStatus } from '../models';
import LinkedInLogo from '../assets/LinkedIn_logo.png';
import githubLogo from '../assets/github.png';
import slackLogo from '../assets/slack.png';
import { useTraineeInfoData } from '../hooks';

import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ConfirmationDialog } from './ConfirmationDialog';
import { ProfilePictureModal } from './ProfilePictureModal';

interface ProfileSidebarProps {
  traineeId: string;
}

/**
 * Image upload modal component
 */
const ImageUploadModal = ({
  open,
  onClose,
  onUpload,
}: {
  open: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
}) => {
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'], // ? maybe change this
    },
    maxFiles: 1,
    onDrop: (files) => {
      if (files.length > 0) {
        onUpload(files[0]);
      }
    },
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {(file.size / 1024).toFixed(2)} KB
    </li>
  ));

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 500,
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Upload Profile Picture</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 4,
            textAlign: 'center',
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
              bgcolor: 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />
          <Typography color="text.secondary">Drag & drop an image here, or click to select</Typography>
        </Box>
      </Box>
    </Modal>
  );
};

/**
 * Component for showing profile page sidebar and sidebar data.
 *
 * @param {string} traineeId trainee id.
 * @returns {ReactNode} A React element that renders profile page sidebar information and profile image.
 */
export const ProfileSidebar = ({ traineeId }: ProfileSidebarProps) => {
  const { data } = useTraineeInfoData(traineeId);

  const slackId = data?.contactInfo?.slackId;
  const githubHandle = data?.contactInfo?.githubHandle;
  const linkedIn = data?.contactInfo?.linkedin;

  //tempt
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);

  const handleImageUpload = (file: File) => {
    console.log('Uploading file:', file);

    // TODO: Implement upload logic

    setUploadModalOpen(false);
  };

  return (
    <>
      <ConfirmationDialog
        confirmButtonText="Delete"
        isOpen={isConfirmationDialogOpen}
        title="Confirm Delete"
        message="Are you sure you want to delete this picture?"
        isLoading={false}
        onConfirm={() => {}}
        onCancel={() => setIsConfirmationDialogOpen(false)}
      />
      
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

        {/* //TODO: here  */}
        <ProfilePictureModal
          data={data}
          onUploadModalOpen={() => setUploadModalOpen(true)}
          onConfirmationDialogOpen={() => setIsConfirmationDialogOpen(true)}
        />

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
            <SidebarLearningStatus learningStatus={data?.educationInfo?.learningStatus}></SidebarLearningStatus>
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
                <img src={slackLogo} alt="Slack" width="32" height="32" style={{ borderRadius: '50%' }} />
              </IconButton>
            </Link>
          )}
          {githubHandle && (
            <Link href={`https://github.com/${githubHandle}`} target="_blank" rel="noopener">
              <IconButton aria-label="GitHub handel">
                <img src={githubLogo} alt="GitHub" width="32" height="32" style={{ borderRadius: '50%' }} />
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

      <ImageUploadModal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={handleImageUpload} />
    </>
  );
};
