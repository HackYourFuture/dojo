import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import { Mentorship, MentorshipPerson } from '../Mentorship';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ListLoader } from '../../../components/ListLoader';
import { MentorshipsTable } from './MentorshipsTable';
import { ProfileSection } from '../../../components/profile/ProfileSection';
import { useGetProfileMentorships } from '../data/mentorship-queries';

// Flat and flush with the section title, so the table's card is the only frame. MUI's line between accordions goes too.
const accordionStyle = { bgcolor: 'transparent', '&:before': { display: 'none' } };
const flushStyle = { paddingX: 0 };

interface MentorshipsAccordionProps {
  title: string;
  // Open when it mounts.
  defaultExpanded?: boolean;
  mentorships: Mentorship[];
  showVolunteer: boolean;
  showTrainee: boolean;
}

// The active or the ended mentorships under a header that folds them away.
const MentorshipsAccordion = ({
  title,
  defaultExpanded = false,
  mentorships,
  showVolunteer,
  showTrainee,
}: MentorshipsAccordionProps) => (
  <Accordion defaultExpanded={defaultExpanded} elevation={0} disableGutters square sx={accordionStyle}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={flushStyle}>
      {/* A span, as the summary is a button and a heading does not belong inside one. */}
      <Typography component="span" variant="subtitle1" sx={{ fontWeight: 500 }}>
        {title}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={flushStyle}>
      <MentorshipsTable mentorships={mentorships} showVolunteer={showVolunteer} showTrainee={showTrainee} />
    </AccordionDetails>
  </Accordion>
);

interface ProfileMentorshipsProps {
  profileType: MentorshipPerson;
  profileId: string;
}

/** The mentorships of a volunteer or a trainee on their profile: the active ones open, the ended ones folded away. */
export const ProfileMentorships = ({ profileType, profileId }: ProfileMentorshipsProps) => {
  const mentorshipsQuery = useGetProfileMentorships(profileType, profileId);
  const { data } = mentorshipsQuery;
  const mentorships = data?.items ?? [];
  const activeMentorships = mentorships.filter((mentorship) => !mentorship.isEnded);
  const endedMentorships = mentorships.filter((mentorship) => mentorship.isEnded);
  // The person's own column is left out, as every row would show them.
  const showVolunteer = profileType !== 'volunteer';
  const showTrainee = profileType !== 'trainee';

  return (
    // No wider than the mentorships page. Positioned, so the first-load spinner centers here instead of on the page.
    <Box sx={{ position: 'relative', maxWidth: 1100 }}>
      <ProfileSection title="Mentorships">
        {/* One block, so the accordions touch as a group and the idle end of the list adds no gap before the divider. */}
        <Box>
          {activeMentorships.length > 0 && (
            <MentorshipsAccordion
              title={`Active (${activeMentorships.length})`}
              defaultExpanded
              mentorships={activeMentorships}
              showVolunteer={showVolunteer}
              showTrainee={showTrainee}
            />
          )}
          {endedMentorships.length > 0 && (
            <MentorshipsAccordion
              title={`Ended (${endedMentorships.length})`}
              mentorships={endedMentorships}
              showVolunteer={showVolunteer}
              showTrainee={showTrainee}
            />
          )}
          {data && mentorships.length === 0 && (
            <Typography sx={{ color: 'text.secondary' }}>No mentorships yet.</Typography>
          )}
          <ListLoader query={mentorshipsQuery} />
        </Box>
      </ProfileSection>
    </Box>
  );
};
