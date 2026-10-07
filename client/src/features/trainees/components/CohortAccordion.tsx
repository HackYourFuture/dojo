import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Cohort } from '../models/trainee-summary';
import { ContactLinkButtons } from '../../../components/ContactLinkButtons';
import { LinkTableRow, RowLinksCell } from '../../../components/LinkTableRow';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LearningStatus } from '../../../data/types/Trainee';
import { getTrackLabel } from '../../../data/labels/traineeLabels';
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
}

/**
 * Component for displaying cohort accordion component.
 *
 * @param {CohortAccordionProps} cohortInfo the cohort and its trainees.
 * @returns {ReactNode} A React element that renders the trainees of one cohort in an accordion component.
 */
const CohortAccordion = ({ cohortInfo }: CohortAccordionProps) => {
  const expandFlag = cohortInfo.cohort !== null ? true : false;

  return (
    <>
      <Accordion defaultExpanded={expandFlag}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {cohortInfo.cohort !== null ? `Cohort ${cohortInfo.cohort}` : 'No cohort assigned'}
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" aria-label="trainees table">
            <TableHead>
              <TableRow>
                <TableCell width={50}></TableCell>
                <TableCell width={200}>Name</TableCell>
                <TableCell width={200}>Status</TableCell>
                <TableCell width={200}>Track</TableCell>
                <TableCell>Location</TableCell>
                <TableCell width={100}>Avg Score</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {cohortInfo.trainees.map((trainee) => (
                <LinkTableRow key={trainee.id} to={trainee.profilePath}>
                  <TableCell>
                    <PersonAvatar src={trainee.thumbnailUrl} name={trainee.displayName} size={40} />
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {trainee.displayName}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap', minWidth: '240px' }}>
                    {trainee.learningStatus === LearningStatus.Graduated ? (
                      <SidebarJobPath jobPath={trainee.jobPath}></SidebarJobPath>
                    ) : (
                      <SidebarLearningStatus learningStatus={trainee.learningStatus}></SidebarLearningStatus>
                    )}
                  </TableCell>
                  <TableCell>{getTrackLabel(trainee.track)}</TableCell>
                  <TableCell>{trainee.location}</TableCell>
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
        </AccordionDetails>
      </Accordion>
    </>
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
