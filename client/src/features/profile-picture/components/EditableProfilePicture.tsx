import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import { ReactNode, useState } from 'react';

import { ConfirmationDialog } from '../../../components/ConfirmationDialog';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { PictureUploadDialog } from './PictureUploadDialog';
import { ProfileType } from '../../../data/types/ProfileType';
import { useDeletePicture } from '../data/mutations';

interface EditableProfilePictureProps {
  profileType: ProfileType;
  profileId: string;
  pictureUrl: string | null;
  // The shape of the picture, which the buttons over it take too.
  variant: 'circular' | 'rounded';
  // The picture itself.
  children: ReactNode;
}

/** The picture of a profile, with buttons over it to upload a new picture or to delete it. */
export const EditableProfilePicture = ({
  profileType,
  profileId,
  pictureUrl,
  variant,
  children,
}: EditableProfilePictureProps) => {
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const {
    mutate: deletePicture,
    isPending: isDeleting,
    error: deleteError,
    reset: resetDelete,
  } = useDeletePicture(profileType, profileId);

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    resetDelete();
  };

  const handleDelete = () => {
    if (pictureUrl) {
      deletePicture(pictureUrl, { onSuccess: closeDeleteDialog });
    }
  };

  return (
    <>
      <Box
        position="relative"
        flexShrink={0}
        overflow="hidden"
        borderRadius={variant === 'circular' ? '50%' : 1}
        sx={{ '&:hover .picture-actions, &:focus-within .picture-actions': { opacity: 1 } }}
      >
        {children}
        <Stack
          className="picture-actions"
          direction="row"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: 'rgba(0, 0, 0, 0.5)',
            opacity: 0,
            transition: 'opacity 0.2s',
            // Touch screens have no hover, so the buttons are always shown there.
            '@media (hover: none)': { opacity: 1 },
          }}
        >
          <Tooltip title="Upload picture">
            <IconButton
              aria-label="Upload picture"
              onClick={() => setIsUploadDialogOpen(true)}
              sx={{ color: 'common.white' }}
            >
              <PhotoCameraIcon />
            </IconButton>
          </Tooltip>
          {pictureUrl && (
            <Tooltip title="Delete picture">
              <IconButton
                aria-label="Delete picture"
                onClick={() => setIsDeleteDialogOpen(true)}
                sx={{ color: 'common.white' }}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          )}
        </Stack>
      </Box>

      <PictureUploadDialog
        key={`upload-picture-${isUploadDialogOpen}`}
        profileType={profileType}
        profileId={profileId}
        isOpen={isUploadDialogOpen}
        onClose={() => setIsUploadDialogOpen(false)}
      />
      <ConfirmationDialog
        isOpen={isDeleteDialogOpen}
        title="Delete picture?"
        message="The picture will be removed from the profile."
        confirmButtonText="Delete"
        isLoading={isDeleting}
        error={deleteError?.message}
        onConfirm={handleDelete}
        onCancel={closeDeleteDialog}
      />
    </>
  );
};
