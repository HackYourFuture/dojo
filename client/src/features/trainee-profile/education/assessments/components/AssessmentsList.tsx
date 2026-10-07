import {
  Chip,
  ChipProps,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { Assessment, AssessmentResult } from '../models/assessment';
import { Fragment, ReactElement, useLayoutEffect, useRef, useState } from 'react';

import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { ListItemActions } from '../../../../../components/ListItemActions';
import MarkdownText from '../../../../../components/MarkdownText';
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

// About five lines. Comments well past it are cut off there, with a link to show the rest.
const COLLAPSED_COMMENTS_HEIGHT = 100;

// The header stays on top while the rows scroll, so it needs the background of the rows behind it.
const headerStyle = { bgcolor: 'background.paper' };

/** The comments of an assessment, cut off with a "Show more" link when they are long. */
const AssessmentComments = ({ comments }: { comments: string }) => {
  const commentsRef = useRef<HTMLDivElement>(null);
  const [isLong, setIsLong] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const isCollapsed = isLong && !isExpanded;

  // Measured before painting, as only the browser knows how many lines the markdown wraps to.
  useLayoutEffect(() => {
    // The scroll height counts the cut-off part too. Half as much again, so the link never hides a line or two.
    setIsLong(commentsRef.current!.scrollHeight > COLLAPSED_COMMENTS_HEIGHT * 1.5);
  }, [comments]);

  return (
    <>
      <Typography
        ref={commentsRef}
        variant="body2"
        component="div"
        sx={{
          color: 'text.secondary',
          // Without the margin under the last paragraph, the comments end as far from the line as the other rows.
          '& > * > :last-child': { marginBottom: 0 },
          ...(isCollapsed && {
            maxHeight: COLLAPSED_COMMENTS_HEIGHT,
            overflow: 'hidden',
            maskImage: 'linear-gradient(to bottom, black 70%, transparent)',
          }),
        }}
      >
        <MarkdownText>{comments}</MarkdownText>
      </Typography>
      {isLong && (
        <Link component="button" variant="body2" underline="hover" onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? 'Show less' : 'Show more'}
        </Link>
      )}
    </>
  );
};

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
                      <AssessmentComments comments={assessment.comments} />
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
