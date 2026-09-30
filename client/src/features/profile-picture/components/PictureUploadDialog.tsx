import { Alert, Box, Button, Dialog, Stack, Typography } from '@mui/material';
import { DragEvent, useState } from 'react';
import { WHOLE_IMAGE_CROP, cropPicture, loadImageFile } from '../utils/pictureHelper';

import { PercentCrop } from 'react-image-crop';
import { PictureCropper } from './PictureCropper';
import { PictureDropZone } from './PictureDropZone';

interface PictureUploadDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  error: string;
  onClose: () => void;
  onSave: (picture: Blob) => void;
}

/** The dialog to choose a picture, by dropping it or from the computer, and to crop it to a square. */
export const PictureUploadDialog = ({ isOpen, isLoading, error, onClose, onSave }: PictureUploadDialogProps) => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<PercentCrop>(WHOLE_IMAGE_CROP);
  const [imageError, setImageError] = useState('');

  const selectFile = async (file: File) => {
    try {
      const newImage = await loadImageFile(file);
      setImage(newImage);
      setCrop(WHOLE_IMAGE_CROP);
      setImageError('');
    } catch (loadError) {
      setImageError((loadError as Error).message);
    }
  };

  // On the whole dialog, so a drop next to the drop zone or on the cropper does not make the browser open the file.
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && !isLoading) {
      selectFile(file);
    }
  };

  const chooseAnotherPicture = () => {
    setImage(null);
    setImageError('');
  };

  const handleSave = async () => {
    if (!image) {
      return;
    }
    try {
      onSave(await cropPicture(image, crop));
    } catch (cropError) {
      setImageError((cropError as Error).message);
    }
  };

  return (
    // Stays open while saving, so the error of a failed upload is shown in it.
    <Dialog
      open={isOpen}
      onClose={isLoading ? undefined : onClose}
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      fullWidth
      maxWidth="sm"
    >
      <Box padding={5}>
        <Typography variant="h4" gutterBottom>
          Upload picture
        </Typography>
        <Box pt={2}>
          {image ? (
            <PictureCropper image={image} crop={crop} onChange={setCrop} />
          ) : (
            <PictureDropZone onFileSelected={selectFile} />
          )}
        </Box>

        {(imageError || error) && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {imageError || error}
          </Alert>
        )}

        {/* A gap, as margins would undo the first button's auto margin. Wraps on a phone, too narrow for three. */}
        <Stack direction="row" spacing={2} useFlexGap flexWrap="wrap" justifyContent="flex-end" mt={2}>
          {image && (
            <Button disabled={isLoading} onClick={chooseAnotherPicture} sx={{ mr: 'auto' }}>
              Choose another picture
            </Button>
          )}
          <Button variant="outlined" disabled={isLoading} onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" loading={isLoading} disabled={!image || isLoading} onClick={handleSave}>
            Save
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};
