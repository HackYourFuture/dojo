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

import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { OrganisationLogo } from '../../../components/OrganisationLogo';
import { OrganisationStatusChip } from './OrganisationStatusChip';
import { OrganisationSummary } from '../Organisation';
import { partnershipTypeLabels } from '../utils/partnershipTypes';
import { useNavigate } from 'react-router-dom';

const RESPONSIBLE_AVATAR_SIZE = 28;

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
            <TableCell sx={headerStyle}>Partnership</TableCell>
            <TableCell sx={headerStyle}>Responsible</TableCell>
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
              <TableCell>
                {/* On one line, as wrapping makes the rows tall even when there is room for the chips. */}
                <Box display="flex" gap={0.5}>
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
