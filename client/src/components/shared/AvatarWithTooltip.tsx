import { Avatar, Tooltip } from '@mui/material';

interface AvatarWithTooltipProps {
  imageUrl: string;
  name: string;
}

export const AvatarWithTooltip = ({ imageUrl, name }: AvatarWithTooltipProps) => {
  return (
    <Tooltip title={name} placement="top">
      <Avatar src={imageUrl}></Avatar>
    </Tooltip>
  );
};
