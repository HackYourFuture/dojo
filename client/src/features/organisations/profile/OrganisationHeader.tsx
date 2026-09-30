import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';

import { EditableProfilePicture } from '../../profile-picture/components/EditableProfilePicture';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInLogo from '../../../assets/LinkedIn_logo.png';
import { Organisation } from '../Organisation';
import { OrganisationLogo } from '../../../components/OrganisationLogo';
import { OrganisationStatusChip } from '../components/OrganisationStatusChip';
import { ReactNode } from 'react';

// About as tall as the three rows of text next to the logo.
const LOGO_SIZE = 96;
const SOCIAL_ICON_SIZE = 20;

interface OrganisationHeaderProps {
  organisation: Organisation;
}

interface SocialLinkProps {
  title: string;
  href: string;
  icon: ReactNode;
}

// Both links go to another site, so they open in a new tab.
const SocialLink = ({ title, href, icon }: SocialLinkProps) => (
  <Tooltip title={title}>
    <IconButton component="a" size="small" href={href} aria-label={title} target="_blank" rel="noopener">
      {icon}
    </IconButton>
  </Tooltip>
);

/** The organisation's logo, name, status, location and links above the profile tabs, as they are saved. */
const OrganisationHeader = ({ organisation }: OrganisationHeaderProps) => {
  const { websiteUrl, linkedinUrl } = organisation;

  return (
    <Box display="flex" alignItems="center" gap={3}>
      <EditableProfilePicture
        profileType="organisation"
        profileId={organisation.id}
        pictureUrl={organisation.pictureUrl}
        variant="rounded"
      >
        <OrganisationLogo src={organisation.pictureUrl} name={organisation.name} size={LOGO_SIZE} />
      </EditableProfilePicture>

      {/* Spaced with a gap instead of margins, which would override the social links offset. */}
      <Stack spacing={1} useFlexGap minWidth={0}>
        <Typography variant="h5" component="h1" fontWeight={600}>
          {organisation.name}
        </Typography>
        <Box display="flex" alignItems="center" flexWrap="wrap" gap={1.5}>
          <OrganisationStatusChip status={organisation.status} />
          {organisation.location && (
            <Typography variant="body2" color="text.secondary">
              {organisation.location}
            </Typography>
          )}
        </Box>
        {(websiteUrl || linkedinUrl) && (
          // Pulled left by the button padding, so the logos line up with the text above.
          <Stack direction="row" spacing={0.5} sx={{ ml: '-5px' }}>
            {websiteUrl && (
              <SocialLink
                title="Website"
                href={websiteUrl}
                icon={<LanguageIcon sx={{ color: 'action.active', fontSize: SOCIAL_ICON_SIZE }} />}
              />
            )}
            {linkedinUrl && (
              <SocialLink
                title="LinkedIn"
                href={linkedinUrl}
                icon={
                  <Box component="img" src={LinkedInLogo} alt="" width={SOCIAL_ICON_SIZE} height={SOCIAL_ICON_SIZE} />
                }
              />
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default OrganisationHeader;
