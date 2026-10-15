import {
  Chip,
  ChipProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Assessment, AssessmentResult } from '../models/assessment';
import { Fragment, ReactElement } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CollapsibleMarkdownText } from '../../../../../components/CollapsibleMarkdownText';
import ErrorIcon from '@mui/icons-material/Error';
import { ListItemActions } from '../../../../../components/ListItemActions';
import WarningIcon from '@mui/icons-material/Warning';
import { formatDateForDisplay } from '../../../../../data/dates';
import { formatTextToFriendly } from '../../../../../data/text';

const resultChips: Record<AssessmentResult, { color: ChipProps['color']; icon: ReactElement }> = {
  [AssessmentResult.Passed]: { color: 'success', icon: <CheckCircleIcon /> },
  [AssessmentResult.PassedWithWarning]: { color: 'warning', icon: <WarningIcon /> },
  [AssessmentResult.Failed]: { color: 'error', icon: <CancelIcon /> },
  [AssessmentResult.Disqualified]: { color: 'error', icon: <ErrorIcon /> },
};

const COLUMN_COUNT = 5;

// The header stays on top while the rows scroll, so it needs the background of the rows behind it.
const headerStyle = { bgcolor: 'background.paper' };

interface AssessmentsListProps {
  assessments: Assessment[];
  onClickEdit: (id: string) => void;
  onClickDelete: (id: string) => void;
}

/** The assessments in a table, each with its comments on a row of their own and a "..." menu. */
export const AssessmentsList: React.FC<AssessmentsListProps> = ({ assessments, onClickEdit, onClickDelete }) => {
  if (assessments.length === 0) {
    return (
      <Typography sx={{ color: 'text.secondary', paddingX: 2, paddingY: 3, bgcolor: 'background.paper' }}>
        No assessments yet
      </Typography>
    );
  }

  return (
    <TableContainer sx={{ bgcolor: 'background.paper', maxHeight: 400, scrollbarWidth: 'thin' }}>
      <Table size="small" stickyHeader aria-label="assessments table">
        <TableHead>
          <TableRow>
            {/* All the room the other columns leave, as the comments would otherwise spread it over every column. */}
            <TableCell sx={headerStyle} width="100%">
              Type
            </TableCell>
            <TableCell sx={headerStyle}>Result</TableCell>
            <TableCell sx={headerStyle} align="right">
              Score
            </TableCell>
            <TableCell sx={headerStyle}>Date</TableCell>
            <TableCell sx={headerStyle} />
          </TableRow>
        </TableHead>
        <TableBody sx={{ '& tr:last-child td': { border: 0 } }}>
          {assessments.map((assessment) => {
            const { color, icon } = resultChips[assessment.result];
            return (
              <Fragment key={assessment.id}>
                {/* With comments, the line under the assessment goes under its comments instead. */}
                <TableRow sx={assessment.comments ? { '& td': { borderBottom: 0 } } : undefined}>
                  <TableCell>{formatTextToFriendly(assessment.type)}</TableCell>
                  <TableCell>
                    <Chip
                      icon={icon}
                      label={formatTextToFriendly(assessment.result)}
                      size="small"
                      variant="outlined"
                      color={color}
                    />
                  </TableCell>
                  <TableCell align="right">{assessment.score !== null ? assessment.score.toFixed(1) : '-'}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{formatDateForDisplay(assessment.date)}</TableCell>
                  <TableCell padding="none">
                    <ListItemActions
                      onEdit={() => onClickEdit(assessment.id)}
                      onDelete={() => onClickDelete(assessment.id)}
                    />
                  </TableCell>
                </TableRow>
                {assessment.comments && (
                  <TableRow>
                    <TableCell colSpan={COLUMN_COUNT} sx={{ paddingTop: 0 }}>
                      <CollapsibleMarkdownText>{assessment.comments}</CollapsibleMarkdownText>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
