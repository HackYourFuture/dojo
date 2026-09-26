import { useState } from 'react';
import { Skeleton, Avatar } from '@mui/material';

export interface TraineeAvatarProps {
  imageUrl: string;
  altText: string;
}

export const TraineeAvatar = ({ imageUrl, altText }: TraineeAvatarProps) => {
  const size = { width: 40, height: 40 };
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (imageUrl.trim().length === 0 || isError) {
    return <Avatar sx={size} alt={altText} variant="square"></Avatar>;
  }

  return (
    <>
      {isLoading && <Skeleton variant="rectangular" width={size.width} height={size.height} />}
      <img
        loading="lazy"
        src={imageUrl}
        alt={altText}
        style={{
          width: `${isLoading ? 0 : size.width}px`,
          height: `${isLoading ? 0 : size.height}px`,
          display: 'block',
        }}
        onError={() => {
          setIsLoading(false);
          setIsError(true);
        }}
        onLoad={() => setIsLoading(false)}
      />
    </>
  );
};
