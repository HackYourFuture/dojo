import { Box, IconButton, Stack, Tooltip } from '@mui/material';

import GitHubIcon from '@mui/icons-material/GitHub';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInLogo from '../../assets/LinkedIn_logo.png';
import { ReactNode } from 'react';
import { getSlackUserUrl } from '../../data/links';
import slackLogo from '../../assets/slack.png';

const SOCIAL_ICON_SIZE = 20;

interface SocialLinkProps {
  title: string;
  href: string;
  icon: ReactNode;
}

// A web page opens in a new tab, and a Slack link opens the app.
const SocialLink = ({ title, href, icon }: SocialLinkProps) => (
  <Tooltip title={title}>
    <IconButton
      component="a"
      size="small"
      href={href}
      aria-label={title}
      {...(href.startsWith('http') && { target: '_blank', rel: 'noopener' })}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

interface SocialLinksProps {
  websiteUrl?: string | null;
  slackId?: string | null;
  githubHandle?: string | null;
  linkedinUrl?: string | null;
}

/** The website, Slack, GitHub and LinkedIn buttons of a profile header, or nothing when none is filled in. */
export const SocialLinks = ({ websiteUrl, slackId, githubHandle, linkedinUrl }: SocialLinksProps) => {
  if (!websiteUrl && !slackId && !githubHandle && !linkedinUrl) {
    return null;
  }

  return (
    // Pulled left by the button padding, so the logos line up with the text above.
    <Stack direction="row" spacing={0.5} sx={{ ml: '-5px' }}>
      {websiteUrl && (
        <SocialLink
          title="Website"
          href={websiteUrl}
          icon={<LanguageIcon sx={{ color: 'action.active', fontSize: SOCIAL_ICON_SIZE }} />}
        />
      )}
      {slackId && (
        <SocialLink
          title="Slack"
          href={getSlackUserUrl(slackId)}
          icon={
            <Box
              component="img"
              src={slackLogo}
              alt=""
              sx={{ width: SOCIAL_ICON_SIZE, height: SOCIAL_ICON_SIZE, borderRadius: '50%' }}
            />
          }
        />
      )}
      {githubHandle && (
        <SocialLink
          title="GitHub"
          href={`https://github.com/${githubHandle}`}
          icon={<GitHubIcon sx={{ color: 'action.active', fontSize: SOCIAL_ICON_SIZE }} />}
        />
      )}
      {linkedinUrl && (
        <SocialLink
          title="LinkedIn"
          href={linkedinUrl}
          icon={
            <Box component="img" src={LinkedInLogo} alt="" sx={{ width: SOCIAL_ICON_SIZE, height: SOCIAL_ICON_SIZE }} />
          }
        />
      )}
    </Stack>
  );
};
