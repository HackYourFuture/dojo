import { Avatar, Box, Fade, IconButton } from '@mui/material';
import React from 'react';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Trainee } from '../models';

interface ProfilePictureModalProps {
  data: Trainee | undefined;
  onUploadModalOpen: () => void;
  onConfirmationDialogOpen: () => void;
}

export const ProfilePictureModal = ({
  data,
  onUploadModalOpen,
  onConfirmationDialogOpen,
}: ProfilePictureModalProps) => {
  const [isHovering, setIsHovering] = React.useState<boolean>(false);

  return (
    <Box
      onMouseEnter={() => {
        setIsHovering(true);
      }}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      height={180}
      width={180}
      display="flex"
      justifyContent="center"
      position="relative"
    >
      <Avatar
        src={data?.imageURL}
        alt={data?.displayName}
        variant="square"
        sx={{
          width: '100%',
          height: '100%',
          filter: isHovering ? 'brightness(0.7)' : 'none',
        }}
      />

      {isHovering && (
        <Box
          sx={{
            display: 'flex',
            position: 'absolute',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Fade in={isHovering}>
            <IconButton onClick={onUploadModalOpen} aria-label="Edit profile picture">
              <EditIcon
                sx={{
                  color: 'white',
                  fontSize: 40,
                  '&:hover': { transform: 'scale(1.1)' },
                  '&:active': { transform: 'scale(0.9)' },
                }}
              />
            </IconButton>
          </Fade>
          <Fade in={isHovering}>
            <IconButton onClick={onConfirmationDialogOpen} aria-label="Delete profile picture">
              <DeleteIcon
                sx={{
                  color: 'white',
                  fontSize: 40,
                  '&:hover': { transform: 'scale(1.1)' },
                  '&:active': { transform: 'scale(0.9)' },
                }}
              />
            </IconButton>
          </Fade>
        </Box>
      )}
    </Box>
  );
};
