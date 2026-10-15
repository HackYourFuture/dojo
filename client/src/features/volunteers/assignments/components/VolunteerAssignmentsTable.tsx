import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { CollapsibleMarkdownText } from '../../../../components/CollapsibleMarkdownText';
import { Fragment } from 'react';
import { ListItemActions } from '../../../../components/ListItemActions';
import { VolunteerAssignment } from '../VolunteerAssignment';
import { formatDateForDisplay } from '../../../../data/dates';
import { volunteerAssignmentTypeLabels } from '../../VolunteerAssignmentType';

const COLUMN_COUNT = 5;

// The header stays on top while the rows scroll, so it needs the background of the rows behind it.
const headerStyle = { bgcolor: 'background.paper' };

// A date never breaks over two lines.
const dateStyle = { whiteSpace: 'nowrap' };

interface VolunteerAssignmentsTableProps {
  assignments: VolunteerAssignment[];
  onClickEdit: (assignment: VolunteerAssignment) => void;
  onClickDelete: (assignment: VolunteerAssignment) => void;
}

/** The assignments in a table, each with its notes on a row of their own and a "..." menu. */
export const VolunteerAssignmentsTable = ({
  assignments,
  onClickEdit,
  onClickDelete,
}: VolunteerAssignmentsTableProps) => {
  if (assignments.length === 0) {
    return (
      <Typography sx={{ color: 'text.secondary', paddingX: 2, paddingY: 3, bgcolor: 'background.paper' }}>
        No assignments yet
      </Typography>
    );
  }

  return (
    // Lower than the lists that have a section of their own, as it sits next to the volunteering fields.
    <TableContainer sx={{ bgcolor: 'background.paper', maxHeight: 300, scrollbarWidth: 'thin' }}>
      <Table size="small" stickyHeader aria-label="assignments table">
        <TableHead>
          <TableRow>
            {/* All the room the other columns leave, as the notes would otherwise spread it over every column. */}
            <TableCell sx={headerStyle} width="100%">
              Type
            </TableCell>
            <TableCell sx={headerStyle} align="right">
              Hours
            </TableCell>
            <TableCell sx={headerStyle}>Start</TableCell>
            <TableCell sx={headerStyle}>End</TableCell>
            <TableCell sx={headerStyle} />
          </TableRow>
        </TableHead>
        <TableBody sx={{ '& tr:last-child td': { border: 0 } }}>
          {assignments.map((assignment) => (
            <Fragment key={assignment.id}>
              {/* With notes, the line under the assignment goes under its notes instead. */}
              <TableRow sx={assignment.notes ? { '& td': { borderBottom: 0 } } : undefined}>
                <TableCell>{volunteerAssignmentTypeLabels[assignment.type]}</TableCell>
                <TableCell align="right">{assignment.estimatedHours ?? '-'}</TableCell>
                <TableCell sx={dateStyle}>{formatDateForDisplay(assignment.startDate)}</TableCell>
                <TableCell sx={dateStyle}>
                  {assignment.endDate ? formatDateForDisplay(assignment.endDate) : 'Ongoing'}
                </TableCell>
                <TableCell padding="none">
                  <ListItemActions onEdit={() => onClickEdit(assignment)} onDelete={() => onClickDelete(assignment)} />
                </TableCell>
              </TableRow>
              {assignment.notes && (
                <TableRow>
                  <TableCell colSpan={COLUMN_COUNT} sx={{ paddingTop: 0 }}>
                    <CollapsibleMarkdownText>{assignment.notes}</CollapsibleMarkdownText>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
