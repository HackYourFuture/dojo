import { Box, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { LinkTableRow, RowLinksCell } from '../../../components/LinkTableRow';

import { ContactLinkButtons } from '../../../components/ContactLinkButtons';
import { PersonAvatar } from '../../../components/PersonAvatar';
import { VolunteerStatusChip } from './VolunteerStatusChip';
import { VolunteerSummary } from '../Volunteer';
import { volunteerExpertiseLabels } from '../VolunteerExpertise';
import { volunteerTypeLabels } from '../VolunteerType';

interface VolunteersTableProps {
  volunteers: VolunteerSummary[];
}

/** The volunteers in a table, where a row opens the profile of its volunteer. */
export const VolunteersTable = ({ volunteers }: VolunteersTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="volunteers table">
        <TableHead>
          <TableRow>
            <TableCell width={50}></TableCell>
            <TableCell>Name</TableCell>
            <TableCell width={150}>Status</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Expertise</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {volunteers.map((volunteer) => (
            <LinkTableRow key={volunteer.id} to={volunteer.profilePath}>
              <TableCell>
                <PersonAvatar src={volunteer.thumbnailUrl} name={volunteer.displayName} size={40} />
              </TableCell>
              <TableCell component="th" scope="row">
                {volunteer.displayName}
              </TableCell>
              <TableCell>
                <VolunteerStatusChip status={volunteer.status} />
              </TableCell>
              <TableCell>{volunteer.volunteerTypes.map((type) => volunteerTypeLabels[type]).join(', ')}</TableCell>
              <TableCell>
                {/* Wraps past about four chips, and earlier when the window is narrow. */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, maxWidth: 420 }}>
                  {volunteer.expertise.map((expertise) => (
                    <Chip key={expertise} label={volunteerExpertiseLabels[expertise]} size="small" variant="outlined" />
                  ))}
                </Box>
              </TableCell>
              <RowLinksCell>
                <ContactLinkButtons contact={volunteer} />
              </RowLinksCell>
            </LinkTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
