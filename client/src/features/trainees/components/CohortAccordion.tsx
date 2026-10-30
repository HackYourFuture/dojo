import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { CityLabel } from '../../geo/components/CityLabel';
import { Cohort, TraineeSummary } from '../models/trainee-summary';
import { ContactLinkButtons } from '../../../components/ContactLinkButtons';
import { LinkTableRow, RowLinksCell } from '../../../components/LinkTableRow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LearningStatus } from '../../../data/types/Trainee';
import { getCohortLabel, getTrackLabel } from '../../../data/labels/traineeLabels';
import { SidebarJobPath } from '../../../components/SidebarJobPath';
import { SidebarLearningStatus } from '../../../components/SidebarLearningStatus';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { PersonAvatar } from '../../../components/PersonAvatar';
import { memo } from 'react';

export interface CohortAccordionProps {
  cohortInfo: Cohort;
  // Open when it mounts.
  defaultExpanded: boolean;
}

/**
 * Component for displaying cohort accordion component.
 *
 * @param {CohortAccordionProps} cohortInfo the cohort and its trainees.
 * @returns {ReactNode} A React element that renders the trainees of one cohort in an accordion component.
 */
const CohortAccordion = ({ cohortInfo, defaultExpanded }: CohortAccordionProps) => {
  return (
    <>
      <Accordion defaultExpanded={defaultExpanded}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>{getCohortLabel(cohortInfo.cohort)}</AccordionSummary>
        <AccordionDetails>
          <TraineesTable trainees={cohortInfo.trainees} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

interface TraineesTableProps {
  trainees: TraineeSummary[];
  // For the list that isn't grouped by cohort.
  showCohort?: boolean;
}

/** The trainees in a table, in a cohort's accordion or on their own when the list isn't grouped. */
export const TraineesTable = ({ trainees, showCohort = false }: TraineesTableProps) => {
  return (
    <Table size="small" aria-label="trainees table">
      <TableHead>
        <TableRow>
          <TableCell width={50}></TableCell>
          <TableCell width={200}>Name</TableCell>
          {showCohort && <TableCell width={80}>Cohort</TableCell>}
          <TableCell width={200}>Status</TableCell>
          <TableCell width={200}>Track</TableCell>
          <TableCell>City</TableCell>
          <TableCell width={100}>Avg Score</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {trainees.map((trainee) => (
          <LinkTableRow key={trainee.id} to={trainee.profilePath}>
            <TableCell>
              <PersonAvatar src={trainee.thumbnailUrl} name={trainee.displayName} size={40} />
            </TableCell>
            <TableCell component="th" scope="row">
              {trainee.displayName}
            </TableCell>
            {showCohort && <TableCell>{trainee.cohort ?? '-'}</TableCell>}
            <TableCell sx={{ whiteSpace: 'nowrap', minWidth: '240px' }}>
              {trainee.learningStatus === LearningStatus.Graduated ? (
                <SidebarJobPath jobPath={trainee.jobPath}></SidebarJobPath>
              ) : (
                <SidebarLearningStatus learningStatus={trainee.learningStatus}></SidebarLearningStatus>
              )}
            </TableCell>
            <TableCell>{getTrackLabel(trainee.track)}</TableCell>
            <TableCell>{trainee.city && <CityLabel city={trainee.city} />}</TableCell>
            <TableCell sx={{ color: getScoreColor(trainee.averageAssessmentScore) }}>
              {trainee.averageAssessmentScore !== null ? trainee.averageAssessmentScore.toFixed(1) : '-'}
            </TableCell>
            <RowLinksCell>
              <ContactLinkButtons contact={trainee} />
            </RowLinksCell>
          </LinkTableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const getScoreColor = (score: number | null) => {
  if (score === null) {
    return 'inherit';
  }
  if (score < 7) {
    return 'orange';
  }
  if (score >= 8.5) {
    return 'green';
  }
  return 'inherit';
};

// Loading a page changes only the last cohort, and React Query keeps the other Cohort objects identical.
export default memo(CohortAccordion);
