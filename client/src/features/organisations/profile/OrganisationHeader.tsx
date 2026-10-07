import { Box, Stack, Typography } from '@mui/material';

import { EditableProfilePicture } from '../../profile-picture/components/EditableProfilePicture';
import { Organisation } from '../Organisation';
import { OrganisationLogo } from '../../../components/OrganisationLogo';
import { OrganisationStatusChip } from '../components/OrganisationStatusChip';
import { SocialLinks } from '../../../components/profile/SocialLinks';

// About as tall as the three rows of text next to the logo.
const LOGO_SIZE = 96;

interface OrganisationHeaderProps {
  organisation: Organisation;
}

/** The organisation's logo, name, status, location and links above the profile tabs, as they are saved. */
const OrganisationHeader = ({ organisation }: OrganisationHeaderProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <EditableProfilePicture
        profileType="organisation"
        profileId={organisation.id}
        pictureUrl={organisation.pictureUrl}
        variant="rounded"
      >
        <OrganisationLogo src={organisation.pictureUrl} name={organisation.name} size={LOGO_SIZE} />
      </EditableProfilePicture>

      {/* Spaced with a gap instead of margins, which would override the social links offset. */}
      <Stack spacing={1} useFlexGap sx={{ minWidth: 0 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
          {organisation.name}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <OrganisationStatusChip status={organisation.status} />
          {organisation.location && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {organisation.location}
            </Typography>
          )}
        </Box>
        <SocialLinks websiteUrl={organisation.websiteUrl} linkedinUrl={organisation.linkedinUrl} />
      </Stack>
    </Box>
  );
};

export default OrganisationHeader;
