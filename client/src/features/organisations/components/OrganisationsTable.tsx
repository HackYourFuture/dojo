import {
  Avatar,
  AvatarGroup,
  Box,
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from '@mui/material';
import { LinkTableRow, RowLinksCell } from '../../../components/LinkTableRow';

import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { OrganisationLogo } from '../../../components/OrganisationLogo';
import { OrganisationStatusChip } from './OrganisationStatusChip';
import { OrganisationSummary } from '../Organisation';
import { partnershipTypeLabels } from '../utils/partnershipTypes';

const RESPONSIBLE_AVATAR_SIZE = 28;

interface OrganisationsTableProps {
  organisations: OrganisationSummary[];
}

/** The organisations in a table, where a row opens the profile of its organisation. */
export const OrganisationsTable = ({ organisations }: OrganisationsTableProps) => {
  return (
    <TableContainer component={Paper}>
      <Table size="small" aria-label="organisations table">
        <TableHead>
          <TableRow>
            <TableCell width={50}></TableCell>
            <TableCell>Name</TableCell>
            <TableCell width={150}>Status</TableCell>
            <TableCell>Partnership</TableCell>
            <TableCell>Responsible</TableCell>
            <TableCell>Location</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>
          {organisations.map((organisation) => (
            <LinkTableRow key={organisation.id} to={organisation.profilePath}>
              <TableCell>
                <OrganisationLogo src={organisation.thumbnailUrl} name={organisation.name} size={40} />
              </TableCell>
              <TableCell component="th" scope="row">
                {organisation.name}
              </TableCell>
              <TableCell>
                <OrganisationStatusChip status={organisation.status} />
              </TableCell>
              <TableCell>
                {/* On one line, as wrapping makes the rows tall even when there is room for the chips. */}
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  {organisation.partnershipTypes.map((type) => (
                    <Chip key={type} label={partnershipTypeLabels[type]} size="small" variant="outlined" />
                  ))}
                </Box>
              </TableCell>
              <TableCell>
                {/* AvatarGroup is a reversed row, so flex-end aligns it left. The primary responsible comes first. */}
                <AvatarGroup
                  max={4}
                  sx={{
                    justifyContent: 'flex-end',
                    '& .MuiAvatar-root': {
                      width: RESPONSIBLE_AVATAR_SIZE,
                      height: RESPONSIBLE_AVATAR_SIZE,
                      fontSize: '0.75rem',
                    },
                  }}
                >
                  {organisation.responsibles.map((responsible) => (
                    <Tooltip key={responsible.id} title={responsible.name}>
                      <Avatar src={responsible.thumbnailUrl ?? undefined} alt={responsible.name} />
                    </Tooltip>
                  ))}
                </AvatarGroup>
              </TableCell>
              <TableCell>{organisation.location}</TableCell>
              <RowLinksCell>
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
              </RowLinksCell>
            </LinkTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
