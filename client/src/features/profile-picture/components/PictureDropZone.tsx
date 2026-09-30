import { ButtonBase, Typography } from '@mui/material';
import { ChangeEvent, useRef } from 'react';

import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface PictureDropZoneProps {
  onFileSelected: (file: File) => void;
}

/** The area to drop a picture on, or to click to choose one. The dialog around it handles the drop. */
export const PictureDropZone = ({ onFileSelected }: PictureDropZoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  return (
    <>
      <ButtonBase
        onClick={() => inputRef.current?.click()}
        sx={{
          width: '100%',
          height: 240,
          flexDirection: 'column',
          gap: 1,
          border: 2,
          borderStyle: 'dashed',
          borderColor: 'divider',
          borderRadius: 2,
          color: 'text.secondary',
          '&:hover': { borderColor: 'primary.main' },
        }}
      >
        <AddPhotoAlternateIcon sx={{ fontSize: 48 }} />
        <Typography>Drop a picture here, or click to choose one</Typography>
      </ButtonBase>
      {/* Next to the button rather than in it, as an input inside a button is not valid HTML. */}
      <input ref={inputRef} type="file" accept="image/*" hidden onChange={handleFileChange} />
    </>
  );
};
