import { Avatar } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

interface TraineeAvatarProps {
  src: string | null;
  name: string;
  size: number;
}

/** The picture of a trainee, or a person when there is no picture or the picture does not load. */
export const TraineeAvatar = ({ src, name, size }: TraineeAvatarProps) => (
  <Avatar variant="rounded" src={src ?? undefined} alt={name} sx={{ width: size, height: size }}>
    <PersonIcon sx={{ width: '75%', height: '75%' }} />
  </Avatar>
);
