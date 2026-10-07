import { LinkTableRow, RowLinksCell } from '../../../components/LinkTableRow';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { ContactLinkButtons } from '../../../components/ContactLinkButtons';
import { PersonAvatar } from '../../../components/PersonAvatar';
import { VolunteerStatusChip } from './VolunteerStatusChip';
import { VolunteerSummary } from '../Volunteer';

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
            <TableCell>Company</TableCell>
            <TableCell>Job role</TableCell>
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
              <TableCell>{volunteer.companyName}</TableCell>
              <TableCell>{volunteer.jobRole}</TableCell>
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
