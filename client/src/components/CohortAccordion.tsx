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

import { Link } from 'react-router-dom';
import { Cohort } from '../models';
import { SidebarJobPath, SidebarLearningStatus } from '.';
import slackLogo from '../assets/slack.png';
import gmailLogo from '../assets/gmail.png';
import githubLogo from '../assets/github.png';
import LinkedInLogo from '../assets/LinkedIn_logo.png';

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
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Cohort {cohortInfo.cohort}</AccordionSummary>
        <AccordionDetails>
          <Table sx={{ minWidth: 850 }} aria-label="cohorts table">
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
                    {/* [TODO] Update with trainee.name once api is updated */}
                    <Link to={`/trainee/${trainee.displayName.replace(/ /g, '-')}_${trainee.id}`}>
                      {trainee.displayName}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {trainee.LearningStatus === 'graduated' ? (
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
                          <img src={slackLogo} alt="Slack" width="32" height="32" style={{ borderRadius: '50%' }} />
                        </IconButton>
                      )}
                      {trainee.email && (
                        <IconButton aria-label="email" href={`mailto:${trainee.email}`}>
                          <img src={gmailLogo} alt="Gmail" width="32" height="32" style={{ borderRadius: '50%' }} />
                        </IconButton>
                      )}
                      {trainee.githubHandle && (
                        <IconButton aria-label="GitHub handel" href={`https://github.com/${trainee.githubHandle}`}>
                          <img src={githubLogo} alt="GitHub" width="32" height="32" style={{ borderRadius: '50%' }} />
                        </IconButton>
                      )}
                      {trainee.linkedIn && (
                        <IconButton aria-label="LinkedIn URL" href={trainee.linkedIn}>
                          <img src={LinkedInLogo} alt="LinkedIn" width="32" height="32" />
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
