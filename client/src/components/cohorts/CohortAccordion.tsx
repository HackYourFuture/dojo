import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { TraineeAvatar } from '../cohorts/TraineeAvatar';

import { Link } from 'react-router-dom';
import { Cohort, LearningStatus } from '../../models';
import { SidebarJobPath, SidebarLearningStatus } from '..';
import slackLogo from '../../assets/slack.png';

export interface CohortAccordionProps {
  cohortInfo: Cohort;
}

/**
 * Component for displaying cohort accordion component.
 *
 * @param {CohortAccordionProps} cohortInfo trainee employment information.
 * @returns {ReactNode} A React element that renders cohorts information in an accordion component.
 */
export const CohortAccordion = ({ cohortInfo }: CohortAccordionProps) => {
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
          <Table size="small" aria-label="cohorts table">
            <TableHead>
              <TableRow sx={headerStyle}>
                <TableCell sx={headerStyle} width={50}></TableCell>
                <TableCell sx={headerStyle} width={200}>
                  Name
                </TableCell>
                <TableCell sx={headerStyle} width={200}>
                  Status
                </TableCell>
                <TableCell sx={headerStyle}>Location</TableCell>
                <TableCell sx={headerStyle} width={50}>
                  Work Permit
                </TableCell>
                <TableCell sx={headerStyle} width={100}>
                  Avg Test Score
                </TableCell>
                <TableCell sx={headerStyle} width={50}>
                  Strikes
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cohortInfo.trainees.map((trainee) => (
                <TableRow
                  key={trainee.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 }, cursor: 'pointer', textDecoration: 'none' }}
                  component={Link}
                  to={trainee.profileURL}
                >
                  <TableCell component="th" scope="row">
                    <TraineeAvatar imageURL={trainee.thumbnailURL ?? ''} altText={trainee.displayName}></TraineeAvatar>
                  </TableCell>
                  <TableCell>{trainee.displayName}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {trainee.LearningStatus === LearningStatus.Graduated ? (
                      <SidebarJobPath jobPath={trainee.JobPath}></SidebarJobPath>
                    ) : (
                      <SidebarLearningStatus learningStatus={trainee.LearningStatus}></SidebarLearningStatus>
                    )}
                  </TableCell>
                  <TableCell>{trainee.location}</TableCell>
                  <TableCell>{convertToString(trainee.hasWorkPermit)}</TableCell>
                  <TableCell sx={{ color: getScoreColor(trainee.averageTestScore) }}>
                    {trainee.averageTestScore !== undefined ? trainee.averageTestScore.toFixed(1) : '-'}
                  </TableCell>
                  <TableCell>{trainee.strikes}</TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }} onClick={(e) => e.stopPropagation()}>
                    <div>
                      {trainee.slackID && (
                        <IconButton aria-label="Slack Id" href={`slack://user?team=T0EJTUQ87&id=${trainee.slackID}`}>
                          <img src={slackLogo} alt="Slack" width="27" height="27" style={{ borderRadius: '50%' }} />
                        </IconButton>
                      )}
                      {trainee.email && (
                        <IconButton aria-label="email" href={`mailto:${trainee.email}`}>
                          <EmailIcon sx={{ color: 'action.active', mr: 1 }} />
                        </IconButton>
                      )}
                      {trainee.githubHandle && (
                        <IconButton
                          aria-label="GitHub handel"
                          href={`https://github.com/${trainee.githubHandle}`}
                          target="_blank"
                        >
                          <GitHubIcon sx={{ color: 'action.active', mr: 1 }} />
                        </IconButton>
                      )}
                      {trainee.linkedIn && (
                        <IconButton aria-label="LinkedIn URL" href={trainee.linkedIn} target="_blank">
                          <LinkedInIcon sx={{ color: 'action.active', mr: 1 }} />
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

const convertToString = (value: boolean | null | undefined) => {
  if (value === null || value === undefined) {
    return '';
  }
  return value ? 'Yes' : 'No';
};

const getScoreColor = (score: number | undefined) => {
  if (score === undefined) {
    return 'inherit';
  }
  if (score < 7) {
    return 'orange';
  }
  if (score < 8.5) {
    return 'black';
  }
  return 'green';
};
