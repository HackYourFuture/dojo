import { Avatar } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';

interface OrganisationLogoProps {
  src: string | null;
  name: string;
  size: number;
}

/** The logo of an organisation, or a building when it has no logo or the logo does not load. */
export const OrganisationLogo = ({ src, name, size }: OrganisationLogoProps) => (
  <Avatar
    variant="rounded"
    src={src ?? undefined}
    alt={name}
    slotProps={{ img: { loading: 'lazy' } }}
    sx={{ width: size, height: size }}
  >
    {/* As big as the person that MUI shows when a trainee has no picture. */}
    <BusinessIcon sx={{ width: '75%', height: '75%' }} />
  </Avatar>
);
