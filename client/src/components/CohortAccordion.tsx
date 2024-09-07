import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import LaunchIcon from '@mui/icons-material/Launch';

import { Link } from 'react-router-dom';
import { Cohort, LearningStatus } from '../models';
import { SidebarJobPath, SidebarLearningStatus } from '.';
import slackLogo from '../assets/slack.png';

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
  const expandFlag = cohortInfo.cohort ? true : false;

  return (
    <>
      <Accordion defaultExpanded={expandFlag}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {cohortInfo.cohort ? `Cohort ${cohortInfo.cohort}` : 'No cohort assigned'}
        </AccordionSummary>
        <AccordionDetails>
          <Table sx={{ minWidth: 850 }} size="small" aria-label="cohorts table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell width={130}>Name</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Work Permit</TableCell>
                <TableCell>Strikes</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cohortInfo.trainees.map((trainee) => (
                <TableRow key={trainee.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    <Avatar
                      alt={trainee.displayName}
                      src={trainee.thumbnailURL ? trainee.thumbnailURL : undefined}
                      variant="square"
                    />
                  </TableCell>
                  <TableCell>
                    <Link
                      style={{ textDecoration: 'none', color: '#5495ff' }}
                      to={`/trainee/${trainee.displayName.replace(/ /g, '-')}_${trainee.id}`}
                    >
                      {trainee.displayName} <LaunchIcon sx={{ fontSize: 'small' }} />
                    </Link>
                  </TableCell>
                  <TableCell>
                    {trainee.LearningStatus === LearningStatus.Graduated ? (
                      <SidebarJobPath jobPath={trainee.JobPath}></SidebarJobPath>
                    ) : (
                      <SidebarLearningStatus learningStatus={trainee.LearningStatus}></SidebarLearningStatus>
                    )}
                  </TableCell>
                  <TableCell>{trainee.location}</TableCell>
                  <TableCell>{trainee.hasWorkPermit ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{trainee.strikes}</TableCell>
                  <TableCell>
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
                        <IconButton aria-label="GitHub handel" href={`https://github.com/${trainee.githubHandle}`}>
                          <GitHubIcon sx={{ color: 'action.active', mr: 1 }} />
                        </IconButton>
                      )}
                      {trainee.linkedIn && (
                        <IconButton aria-label="LinkedIn URL" href={trainee.linkedIn}>
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
