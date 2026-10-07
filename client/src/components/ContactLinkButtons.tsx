import EmailIcon from '@mui/icons-material/EmailOutlined';
import GitHubIcon from '@mui/icons-material/GitHub';
import { IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { getSlackUserUrl } from '../data/links';
import slackLogo from '../assets/slack.png';

interface ContactLinkButtonsProps {
  contact: {
    slackId: string | null;
    email: string;
    githubHandle: string | null;
    linkedinUrl: string | null;
  };
}

/** The Slack, email, GitHub and LinkedIn buttons of a person in a list, for the ones that are filled in. */
export const ContactLinkButtons = ({ contact }: ContactLinkButtonsProps) => {
  const { slackId, email, githubHandle, linkedinUrl } = contact;

  return (
    <>
      {slackId && (
        <IconButton aria-label="Slack" href={getSlackUserUrl(slackId)}>
          <img src={slackLogo} alt="" width="27" height="27" style={{ borderRadius: '50%' }} />
        </IconButton>
      )}
      <IconButton aria-label="Email" href={`mailto:${email}`}>
        <EmailIcon sx={{ color: 'action.active' }} />
      </IconButton>
      {githubHandle && (
        <IconButton aria-label="GitHub" href={`https://github.com/${githubHandle}`} target="_blank" rel="noopener">
          <GitHubIcon sx={{ color: 'action.active' }} />
        </IconButton>
      )}
      {linkedinUrl && (
        <IconButton aria-label="LinkedIn" href={linkedinUrl} target="_blank" rel="noopener">
          <LinkedInIcon sx={{ color: 'action.active' }} />
        </IconButton>
      )}
    </>
  );
};
