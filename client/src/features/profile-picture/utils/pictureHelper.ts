import { PercentCrop } from 'react-image-crop';

// The size of the pictures the server stores, so it does not scale them again.
const PICTURE_SIZE = 700;

// The crop a new picture starts with: the whole image, fitted in the square.
export const WHOLE_IMAGE_CROP: PercentCrop = { unit: '%', x: 0, y: 0, width: 100, height: 100 };

// Read as a data URL, because the CSP in nginx.conf does not allow blob: images.
export const loadImageFile = (file: File) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('That file is not a picture.'));
      return;
    }

    const openError = new Error('That picture could not be opened. Try a JPEG or PNG.');
    const reader = new FileReader();
    const image = new Image();
    reader.onload = () => {
      image.src = reader.result as string;
    };
    reader.onerror = () => reject(openError);
    image.onload = () => {
      // An SVG without a size has no pixels to crop.
      if (image.naturalWidth && image.naturalHeight) {
        resolve(image);
      } else {
        reject(openError);
      }
    };
    image.onerror = () => reject(openError);
    reader.readAsDataURL(file);
  });
};

// Crops the image to a square PNG. The crop is in percent of the white square the cropper centres the image in.
export const cropPicture = (image: HTMLImageElement, crop: PercentCrop) => {
  const { naturalWidth: width, naturalHeight: height } = image;
  const side = Math.max(width, height);
  const scale = PICTURE_SIZE / ((crop.width / 100) * side);

  const canvas = document.createElement('canvas');
  canvas.width = PICTURE_SIZE;
  canvas.height = PICTURE_SIZE;
  const context = canvas.getContext('2d')!;
  // White where the crop is outside the image.
  context.fillStyle = '#fff';
  context.fillRect(0, 0, PICTURE_SIZE, PICTURE_SIZE);
  context.imageSmoothingQuality = 'high';
  const x = ((side - width) / 2 - (crop.x / 100) * side) * scale;
  const y = ((side - height) / 2 - (crop.y / 100) * side) * scale;
  context.drawImage(image, x, y, width * scale, height * scale);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('The picture could not be cropped.'));
      }
    }, 'image/png');
  });
};
