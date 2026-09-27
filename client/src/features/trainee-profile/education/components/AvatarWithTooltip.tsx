import { Avatar, Tooltip } from '@mui/material';

interface AvatarWithTooltipProps {
  imageUrl: string | null;
  name: string;
}

export const AvatarWithTooltip = ({ imageUrl, name }: AvatarWithTooltipProps) => {
  return (
    <Tooltip title={name} placement="top">
      <Avatar src={imageUrl ?? undefined}></Avatar>
    </Tooltip>
  );
};
