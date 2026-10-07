import { Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface PersonAvatarProps {
  src: string | null;
  name: string;
  size: number;
}

export const PersonAvatar = ({ src, name, size }: PersonAvatarProps) => (
  <Avatar variant="rounded" src={src ?? undefined} alt={name} sx={{ width: size, height: size }}>
    <PersonIcon sx={{ width: '75%', height: '75%' }} />
  </Avatar>
);
