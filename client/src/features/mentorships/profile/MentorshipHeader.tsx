import { Avatar, Box, Link, Stack, Typography } from '@mui/material';
import { Mentorship, formatPeriod } from '../Mentorship';

import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import { MentorshipStatusChip } from '../components/MentorshipStatusChip';
import { MentorshipTypeChip } from '../components/MentorshipTypeChip';
import { ReactNode } from 'react';
import { Link as RouterLink } from 'react-router';
import { TraineeReference } from '../../../data/types/Trainee';
import { VolunteerReference } from '../../volunteers/Volunteer';

// As tall as the name and the role under it. The API only has the 70px thumbnails, so no bigger.
const PICTURE_SIZE = 56;

interface PersonProps {
  person: VolunteerReference | TraineeReference;
  role: 'Mentor' | 'Trainee';
}

// The picture, the name, which opens the profile, and the role under the name. Spans, as it sits in the heading.
const Person = ({ person, role }: PersonProps) => (
  <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
    <Avatar
      component="span"
      src={person.thumbnailUrl ?? undefined}
      alt={person.name}
      sx={{ width: PICTURE_SIZE, height: PICTURE_SIZE }}
    />
    <Box component="span" sx={{ display: 'inline-flex', flexDirection: 'column' }}>
      <Link component={RouterLink} to={person.profilePath} color="textPrimary" underline="hover">
        {person.name}
      </Link>
      <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
        {role}
      </Typography>
    </Box>
  </Box>
);

interface MentorshipHeaderProps {
  mentorship: Mentorship;
  // The Edit button, at the top right.
  children: ReactNode;
}

/** The mentor and the trainee, the type, the status and the period above the details, as they are saved. */
const MentorshipHeader = ({ mentorship, children }: MentorshipHeaderProps) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      <Stack spacing={1.5} useFlexGap sx={{ minWidth: 0 }}>
        {/* One heading, as the two names together are the title of the page. */}
        <Typography
          variant="h5"
          component="h1"
          sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, fontWeight: 600 }}
        >
          <Person person={mentorship.volunteer} role="Mentor" />
          <ArrowForwardRoundedIcon titleAccess="mentors" sx={{ color: 'text.disabled' }} />
          <Person person={mentorship.trainee} role="Trainee" />
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1.5 }}>
          <MentorshipTypeChip type={mentorship.type} />
          <MentorshipStatusChip isEnded={mentorship.isEnded} />
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            {formatPeriod(mentorship.startDate, mentorship.endDate)}
          </Typography>
        </Box>
      </Stack>

      <Box sx={{ marginLeft: 'auto', alignSelf: 'flex-start', flexShrink: 0 }}>{children}</Box>
    </Box>
  );
};

export default MentorshipHeader;
