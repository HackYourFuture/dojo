import 'react-image-crop/dist/ReactCrop.css';

import ReactCrop, { PercentCrop } from 'react-image-crop';

import { Box } from '@mui/material';

interface PictureCropperProps {
  image: HTMLImageElement;
  crop: PercentCrop;
  onChange: (crop: PercentCrop) => void;
}

/** A square crop box over the image, which is fitted in a white square so the box can take in all of it. */
export const PictureCropper = ({ image, crop, onChange }: PictureCropperProps) => (
  <ReactCrop
    crop={crop}
    onChange={(_, percentCrop) => onChange(percentCrop)}
    aspect={1}
    keepSelection
    minWidth={32}
    // Its class also limits it to the dialog's width on a phone. 50vh keeps the dialog from scrolling on a laptop.
    style={{ display: 'block', width: 'min(400px, 50vh)', margin: '0 auto', cursor: 'default' }}
  >
    {/* The image is the square itself, because the cropper measures and styles its direct child. */}
    <Box
      component="img"
      src={image.src}
      alt="The picture to crop"
      draggable={false}
      sx={{ width: '100%', aspectRatio: '1', objectFit: 'contain', bgcolor: 'common.white' }}
    />
  </ReactCrop>
);
