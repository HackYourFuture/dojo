import { Avatar, Box, Stack, Typography } from '@mui/material';

import { EditableProfilePicture } from '../../profile-picture/components/EditableProfilePicture';
import { ReactNode } from 'react';
import { SocialLinks } from '../../../components/profile/SocialLinks';
import { Volunteer } from '../Volunteer';
import { VolunteerStatusChip } from '../components/VolunteerStatusChip';

// About as tall as the three rows of text next to the picture.
const PICTURE_SIZE = 96;

interface VolunteerHeaderProps {
  volunteer: Volunteer;
  // The Edit and Actions buttons, at the top right.
  children: ReactNode;
}

/** The volunteer's picture, name, status, work and social links above the profile tabs, as they are saved. */
const VolunteerHeader = ({ volunteer, children }: VolunteerHeaderProps) => {
  const { pronouns, slackId, githubHandle, linkedinUrl } = volunteer;
  // Like "Senior Developer at Acme B.V.", or just the one that is filled in.
  const work = [volunteer.jobRole, volunteer.companyName].filter(Boolean).join(' at ');

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <EditableProfilePicture
        profileType="volunteer"
        profileId={volunteer.id}
        pictureUrl={volunteer.pictureUrl}
        variant="circular"
      >
        <Avatar
          src={volunteer.pictureUrl ?? undefined}
          alt={volunteer.displayName}
          sx={{ width: PICTURE_SIZE, height: PICTURE_SIZE }}
        />
      </EditableProfilePicture>

      {/* Spaced with a gap instead of margins, which would override the social links offset. */}
      <Stack spacing={1} useFlexGap sx={{ minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap', columnGap: 1.5 }}>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600 }}>
            {volunteer.displayName}
          </Typography>
          {pronouns && <Typography sx={{ color: 'text.secondary' }}>{pronouns}</Typography>}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <VolunteerStatusChip status={volunteer.status} />
          {work && (
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {work}
            </Typography>
          )}
        </Box>
        <SocialLinks slackId={slackId} githubHandle={githubHandle} linkedinUrl={linkedinUrl} />
      </Stack>

      <Box sx={{ marginLeft: 'auto', alignSelf: 'flex-start', flexShrink: 0 }}>{children}</Box>
    </Box>
  );
};

export default VolunteerHeader;
