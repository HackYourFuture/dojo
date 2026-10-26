import { Box, Button, Container, LinearProgress, Stack, Typography } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import { AddMentorshipDialog } from './components/AddMentorshipDialog';
import { ListLoader } from '../../components/ListLoader';
import { MentorshipFilterBar } from './components/MentorshipFilterBar';
import { MentorshipFilters } from './Mentorship';
import { MentorshipStatus } from './MentorshipStatus';
import { MentorshipsTable } from './components/MentorshipsTable';
import { useGetMentorships } from './data/mentorship-queries';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useSearchParams } from 'react-router';
import { useState } from 'react';

/** The mentorships page, the latest start date first and filtered by the URL, with the ended mentorships dimmed. */
const MentorshipsOverviewPage = () => {
  usePageTitle('Mentorships');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const filters: MentorshipFilters = {
    volunteerId: searchParams.get('volunteerId') ?? '',
    traineeId: searchParams.get('traineeId') ?? '',
    type: searchParams.getAll('type'),
    // Active when the URL has no status. An empty status=, from unticking both, means any status.
    status: searchParams.has('status')
      ? searchParams.getAll('status').filter((status) => status !== '')
      : [MentorshipStatus.Active],
  };

  const mentorshipsQuery = useGetMentorships(filters);
  const { data, isPlaceholderData } = mentorshipsQuery;
  // The default Active status counts too, so an empty list doesn't claim there are no mentorships at all.
  const isFiltered = Object.values(filters).some((value) => value.length > 0);

  return (
    <Container fixed>
      <Box sx={{ p: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="h4">Mentorships</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsAddDialogOpen(true)}>
            Add Mentorship
          </Button>
        </Stack>
        <MentorshipFilterBar filters={filters} />
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {data ? `${data.total} ${data.total === 1 ? 'mentorship' : 'mentorships'}` : '\u00a0'}
        </Typography>
        <LinearProgress sx={{ height: 2, mt: 0.5, mb: 1.5, visibility: isPlaceholderData ? 'visible' : 'hidden' }} />
        {data &&
          (data.items.length > 0 ? (
            <MentorshipsTable mentorships={data.items} />
          ) : (
            <Typography sx={{ color: 'text.secondary' }}>
              {isFiltered ? 'No mentorships match these filters.' : 'No mentorships yet.'}
            </Typography>
          ))}

        <ListLoader query={mentorshipsQuery} />
      </Box>

      <AddMentorshipDialog
        // A new key on every open and close resets the form.
        key={`add-mentorship-${isAddDialogOpen}`}
        isOpen={isAddDialogOpen}
        handleClose={() => setIsAddDialogOpen(false)}
      />
    </Container>
  );
};

export default MentorshipsOverviewPage;
