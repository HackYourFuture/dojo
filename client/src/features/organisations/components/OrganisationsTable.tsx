import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { OrganisationLogo } from '../../../components/OrganisationLogo';
import { OrganisationStatusChip } from './OrganisationStatusChip';
import { OrganisationSummary } from '../Organisation';
import { useNavigate } from 'react-router-dom';

interface OrganisationsTableProps {
  organisations: OrganisationSummary[];
}

const headerStyle = {
  fontWeight: 'bold',
};

/** The organisations in a table, where a row opens the profile of its organisation. */
export const OrganisationsTable = ({ organisations }: OrganisationsTableProps) => {
  const navigate = useNavigate();

  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="organisations table">
        <TableHead>
          <TableRow>
            <TableCell sx={headerStyle} width={50}></TableCell>
            <TableCell sx={headerStyle}>Name</TableCell>
            <TableCell sx={headerStyle} width={150}>
              Status
            </TableCell>
            <TableCell sx={headerStyle}>Location</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {organisations.map((organisation) => (
            <TableRow
              key={organisation.id}
              hover
              // A link as the row would put an <a> in the <tbody>, so the row navigates on click instead.
              onClick={() => navigate(organisation.profilePath)}
              sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer' }}
            >
              <TableCell>
                <OrganisationLogo src={organisation.thumbnailUrl} name={organisation.name} size={40} />
              </TableCell>
              <TableCell component="th" scope="row">
                {organisation.name}
              </TableCell>
              <TableCell>
                <OrganisationStatusChip status={organisation.status} />
              </TableCell>
              <TableCell>{organisation.location}</TableCell>
              {/* The links open the organisation's own sites, so clicking here does not open the profile. */}
              <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'end' }} onClick={(e) => e.stopPropagation()}>
                {organisation.websiteUrl && (
                  <IconButton aria-label="Website" href={organisation.websiteUrl} target="_blank" rel="noopener">
                    <LanguageIcon sx={{ color: 'action.active' }} />
                  </IconButton>
                )}
                {organisation.linkedinUrl && (
                  <IconButton aria-label="LinkedIn" href={organisation.linkedinUrl} target="_blank" rel="noopener">
                    <LinkedInIcon sx={{ color: 'action.active' }} />
                  </IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
