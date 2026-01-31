import { useState } from 'react';
import { Skeleton, Avatar } from '@mui/material';

export interface TraineeAvatarProps {
  imageURL: string;
  altText: string;
}

export const TraineeAvatar = ({ imageURL, altText }: TraineeAvatarProps) => {
  const size = { width: 40, height: 40 };
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (isError) {
    return <Avatar sx={size} alt={altText} variant="square"></Avatar>;
  }

  return (
    <>
      {isLoading && <Skeleton variant="rectangular" width={size.width} height={size.height} />}
      <img
        loading="lazy"
        src={imageURL}
        alt={altText}
        style={{
          width: `${isLoading ? 0 : size.width}px`,
          height: `${isLoading ? 0 : size.height}px`,
          display: isLoading ? 'block' : 'block',
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
