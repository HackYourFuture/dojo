import { Box, Button, Checkbox, ListItemText, MenuItem, Stack, TextField } from '@mui/material';
import { MentorshipStatus, mentorshipStatusLabels } from '../MentorshipStatus';
import { pickedLabels, setParam, toValues } from '../../../data/listFilters';

import { useMemo, useState } from 'react';

import { MentorshipFilters } from '../Mentorship';
import { SelectOption } from '../../../data/types/SelectOption';
import { TraineeAutocomplete } from '../../trainees/components/TraineeAutocomplete';
import { TraineeReference } from '../../../data/types/Trainee';
import { VolunteerAutocomplete } from '../../volunteers/components/VolunteerAutocomplete';
import { VolunteerReference } from '../../volunteers/Volunteer';
import { mentorshipTypeOptions } from '../MentorshipType';
import { useGetTrainee } from '../../trainee-profile/data/trainee-queries';
import { useGetVolunteer } from '../../volunteers/data/volunteer-queries';
import { useSearchParams } from 'react-router';

const statusOptions: SelectOption[] = Object.values(MentorshipStatus).map((status) => ({
  label: mentorshipStatusLabels[status],
  value: status,
}));

const URL_UPDATE = { replace: true, preventScrollReset: true, flushSync: true };

// The options of a dropdown, with a checkmark on the picked ones.
const menuItems = (options: SelectOption[], picked: string[]) =>
  options.map((option) => (
    <MenuItem key={option.value} value={option.value}>
      <Checkbox size="small" checked={picked.includes(option.value)} sx={{ py: 0 }} />
      <ListItemText primary={option.label} />
    </MenuItem>
  ));

interface MentorshipFilterBarProps {
  filters: MentorshipFilters;
}

/** The filters above the mentorships list, kept in the URL so Back and links bring them back. */
export const MentorshipFilterBar = ({ filters }: MentorshipFilterBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Picked here, so a new pick shows at once, without waiting for the person to load by id.
  const [pickedVolunteer, setPickedVolunteer] = useState<VolunteerReference | null>(null);
  const [pickedTrainee, setPickedTrainee] = useState<TraineeReference | null>(null);
  // After Back or a link the URL only holds the ids, so the mentor and trainee load by id.
  const { data: volunteer } = useGetVolunteer(filters.volunteerId);
  const { data: trainee } = useGetTrainee(filters.traineeId);
  // The same object until the person changes, as the picker resets the typed text when it gets a new one.
  const loadedVolunteer = useMemo(
    () =>
      volunteer
        ? {
            id: volunteer.id,
            name: volunteer.displayName,
            profilePath: volunteer.profilePath,
            thumbnailUrl: volunteer.thumbnailUrl,
          }
        : null,
    [volunteer]
  );
  const loadedTrainee = useMemo(
    () =>
      trainee
        ? {
            id: trainee.id,
            name: trainee.displayName,
            profilePath: trainee.profilePath,
            thumbnailUrl: trainee.thumbnailUrl,
          }
        : null,
    [trainee]
  );

  // Replaces the history entry, so Back leaves the list rather than undoing a filter, and keeps the scroll position.
  // Synchronous, so a second pick in an open dropdown starts from the first one.
  const setFilter = (key: string, values: string[]) =>
    setSearchParams((params) => setParam(params, key, values), URL_UPDATE);

  // No status in the URL means Active, so unticking both keeps an empty status= for any status.
  const setStatusFilter = (values: string[]) =>
    setSearchParams((params) => {
      setParam(params, 'status', values);
      if (values.length === 0) {
        params.set('status', '');
      }
      return params;
    }, URL_UPDATE);

  // Back to the default filters, which show the active mentorships.
  const clearFilters = () => setSearchParams({}, URL_UPDATE);

  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'center', mt: 3, mb: 2 }}>
      <Box sx={{ width: 240 }}>
        <VolunteerAutocomplete
          size="small"
          label="Mentor"
          placeholder="Any"
          value={pickedVolunteer?.id === filters.volunteerId ? pickedVolunteer : loadedVolunteer}
          onChange={(volunteer) => {
            setPickedVolunteer(volunteer);
            setFilter('volunteerId', volunteer ? [volunteer.id] : []);
          }}
        />
      </Box>
      <Box sx={{ width: 240 }}>
        <TraineeAutocomplete
          size="small"
          label="Trainee"
          placeholder="Any"
          value={pickedTrainee?.id === filters.traineeId ? pickedTrainee : loadedTrainee}
          onChange={(trainee) => {
            setPickedTrainee(trainee);
            setFilter('traineeId', trainee ? [trainee.id] : []);
          }}
        />
      </Box>
      <TextField
        select
        size="small"
        label="Type"
        value={filters.type}
        onChange={(event) => setFilter('type', toValues(event.target.value))}
        sx={{ width: 170 }}
        slotProps={{
          select: {
            multiple: true,
            displayEmpty: true,
            renderValue: () => pickedLabels(mentorshipTypeOptions, filters.type),
          },
          inputLabel: { shrink: true },
        }}
      >
        {menuItems(mentorshipTypeOptions, filters.type)}
      </TextField>
      <TextField
        select
        size="small"
        label="Status"
        value={filters.status}
        onChange={(event) => setStatusFilter(toValues(event.target.value))}
        sx={{ width: 170 }}
        slotProps={{
          select: {
            multiple: true,
            displayEmpty: true,
            renderValue: () => pickedLabels(statusOptions, filters.status),
          },
          inputLabel: { shrink: true },
        }}
      >
        {menuItems(statusOptions, filters.status)}
      </TextField>
      {searchParams.size > 0 && <Button onClick={clearFilters}>Clear filters</Button>}
    </Stack>
  );
};
