import { Link } from '@mui/material';
import { MouseEvent } from 'react';
import { PersonAvatar } from '../../../components/PersonAvatar';
import { Link as RouterLink } from 'react-router';
import { TraineeReference } from '../../../data/types/Trainee';
import { VolunteerReference } from '../../volunteers/Volunteer';

// Inside a LinkTableRow a click, or a middle click, opens the person's profile and not the row's page too.
const stopRowClick = (event: MouseEvent) => event.stopPropagation();

interface PersonLinkProps {
  person: VolunteerReference | TraineeReference;
}

/** The picture and the name, which open the person's profile. */
export const PersonLink = ({ person }: PersonLinkProps) => (
  <Link
    component={RouterLink}
    to={person.profilePath}
    color="textPrimary"
    underline="hover"
    onClick={stopRowClick}
    onAuxClick={stopRowClick}
    sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, fontWeight: 500, overflowWrap: 'anywhere' }}
  >
    <PersonAvatar src={person.thumbnailUrl} size={32} />
    {person.name}
  </Link>
);
