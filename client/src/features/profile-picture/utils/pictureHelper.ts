import { PercentCrop } from 'react-image-crop';

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

// The crop is in percent of the white square the cropper centres the image in, so it can take in some of the white.
export const cropPicture = (image: HTMLImageElement, crop: PercentCrop) => {
  const { naturalWidth: width, naturalHeight: height } = image;
  const side = Math.max(width, height);
  const size = Math.round((crop.width / 100) * side);
  // Where the crop starts on the image, negative when it starts in the white.
  const left = Math.round((crop.x / 100) * side - (side - width) / 2);
  const top = Math.round((crop.y / 100) * side - (side - height) / 2);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d')!;
  context.fillStyle = '#fff';
  context.fillRect(0, 0, size, size);
  context.drawImage(image, -left, -top);

  return new Promise<Blob>((resolve, reject) => {
    // A JPEG, because a PNG of a phone photo is bigger than the server's 10 MB limit.
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('The picture could not be cropped.'));
      }
    }, 'image/jpeg');
  });
};
