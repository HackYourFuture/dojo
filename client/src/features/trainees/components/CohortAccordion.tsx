import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import { Cohort } from '../models/trainee-summary';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GitHubIcon from '@mui/icons-material/GitHub';
import IconButton from '@mui/material/IconButton';
import { LearningStatus } from '../../../data/types/Trainee';
import { getTrackLabel } from '../../../data/labels/traineeLabels';
import { Link } from 'react-router-dom';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { SidebarJobPath } from '../../../components/SidebarJobPath';
import { SidebarLearningStatus } from '../../../components/SidebarLearningStatus';
import Table from '@mui/material/Table';
import { getSlackUserUrl } from '../../../data/links';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { TraineeAvatar } from './TraineeAvatar';
import { memo } from 'react';
import slackLogo from '../../../assets/slack.png';

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

  const headerStyle = {
    fontWeight: 'bold',
  };
  return (
    <>
      <Accordion defaultExpanded={expandFlag}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {cohortInfo.cohort !== null ? `Cohort ${cohortInfo.cohort}` : 'No cohort assigned'}
        </AccordionSummary>
        <AccordionDetails>
          <Table size="small" aria-label="trainees table">
            <TableHead>
              <TableRow sx={headerStyle}>
                <TableCell sx={headerStyle} width={50}></TableCell>
                <TableCell sx={headerStyle} width={200}>
                  Name
                </TableCell>
                <TableCell sx={headerStyle} width={200}>
                  Status
                </TableCell>
                <TableCell sx={headerStyle} width={200}>
                  Track
                </TableCell>
                <TableCell sx={headerStyle}>Location</TableCell>
                <TableCell sx={headerStyle} width={100}>
                  Avg Score
                </TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {cohortInfo.trainees.map((trainee) => (
                <TableRow
                  key={trainee.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', textDecoration: 'none' }}
                  component={Link}
                  to={trainee.profilePath}
                >
                  <TableCell component="th" scope="row">
                    <TraineeAvatar src={trainee.thumbnailUrl} name={trainee.displayName} size={40} />
                  </TableCell>
                  <TableCell>{trainee.displayName}</TableCell>
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
                  <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'end' }} onClick={(e) => e.stopPropagation()}>
                    <div>
                      {trainee.slackId && (
                        <IconButton aria-label="Slack Id" href={getSlackUserUrl(trainee.slackId)}>
                          <img src={slackLogo} alt="Slack" width="27" height="27" style={{ borderRadius: '50%' }} />
                        </IconButton>
                      )}
                      {trainee.email && (
                        <IconButton aria-label="email" href={`mailto:${trainee.email}`}>
                          <EmailIcon sx={{ color: 'action.active' }} />
                        </IconButton>
                      )}
                      {trainee.githubHandle && (
                        <IconButton
                          aria-label="GitHub handel"
                          href={`https://github.com/${trainee.githubHandle}`}
                          target="_blank"
                        >
                          <GitHubIcon sx={{ color: 'action.active' }} />
                        </IconButton>
                      )}
                      {trainee.linkedinUrl && (
                        <IconButton aria-label="LinkedIn URL" href={trainee.linkedinUrl} target="_blank">
                          <LinkedInIcon sx={{ color: 'action.active' }} />
                        </IconButton>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
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
