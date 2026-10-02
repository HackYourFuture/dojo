import { Alert, Box, Button, Dialog, Stack, Typography } from '@mui/material';
import { DragEvent, useState } from 'react';

import { PercentCrop } from 'react-image-crop';
import { PictureCropper } from './PictureCropper';
import { PictureDropZone } from './PictureDropZone';
import { ProfileType } from '../../../data/types/ProfileType';
import { loadImageFile } from '../utils/pictureHelper';
import { useUploadPicture } from '../data/mutations';

// The crop a new picture starts with: the whole image, fitted in the square.
const WHOLE_IMAGE_CROP: PercentCrop = { unit: '%', x: 0, y: 0, width: 100, height: 100 };

interface PictureUploadDialogProps {
  profileType: ProfileType;
  profileId: string;
  isOpen: boolean;
  onClose: () => void;
}

/** The dialog to choose a picture, by dropping it or from the computer, crop it to a square and upload it. */
export const PictureUploadDialog = ({ profileType, profileId, isOpen, onClose }: PictureUploadDialogProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<PercentCrop>(WHOLE_IMAGE_CROP);
  const [imageError, setImageError] = useState('');
  const {
    mutate: uploadPicture,
    isPending: isUploading,
    error: uploadError,
    reset: resetUpload,
  } = useUploadPicture(profileType, profileId);

  // Also clears the error of uploading the previous image.
  const changeImage = (newImage: HTMLImageElement | null) => {
    setImage(newImage);
    setCrop(WHOLE_IMAGE_CROP);
    setImageError('');
    resetUpload();
  };

  const selectFile = async (file: File) => {
    try {
      changeImage(await loadImageFile(file));
    } catch (loadError) {
      setImageError((loadError as Error).message);
    }
  };

  // On the whole dialog, so a drop next to the drop zone or on the cropper does not make the browser open the file.
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (isUploading) {
      return;
    }
    const file = event.dataTransfer.files[0];
    if (file) {
      selectFile(file);
    } else {
      // A picture dragged from a website only brings its URL.
      setImageError('That is not a picture file. To use a picture from a website, save it first.');
    }
  };

  const handleSave = () => {
    if (image) {
      uploadPicture({ image, crop }, { onSuccess: onClose });
    }
  };

  const error = imageError || uploadError?.message;

  return (
    // Stays open while saving, so the error of a failed upload is shown in it.
    <Dialog
      open={isOpen}
      onClose={isUploading ? undefined : onClose}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      fullWidth
      maxWidth="sm"
    >
      <Box sx={{ padding: 5 }}>
        <Typography variant="h4" gutterBottom>
          Upload picture
        </Typography>
        <Box sx={{ pt: 2 }}>
          {image ? (
            <PictureCropper image={image} crop={crop} onChange={setCrop} />
          ) : (
            <PictureDropZone onFileSelected={selectFile} />
          )}
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* A gap, as margins would undo the first button's auto margin. Wraps on a phone, too narrow for three. */}
        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', justifyContent: 'flex-end', mt: 2 }}>
          {image && (
            <Button disabled={isUploading} onClick={() => changeImage(null)} sx={{ mr: 'auto' }}>
              Choose another picture
            </Button>
          )}
          <Button variant="outlined" disabled={isUploading} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" loading={isUploading} disabled={!image || isUploading} onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};
