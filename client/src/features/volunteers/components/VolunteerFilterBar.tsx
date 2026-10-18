import { Button, Checkbox, InputAdornment, ListItemText, MenuItem, Stack, TextField } from '@mui/material';
import { VolunteerAssignmentType, volunteerAssignmentTypeLabels } from '../VolunteerAssignmentType';
import { VolunteerExpertise, volunteerExpertiseLabels } from '../VolunteerExpertise';
import { VolunteerStatus, volunteerStatusLabels } from '../VolunteerStatus';
import { VolunteerType, volunteerTypeLabels } from '../VolunteerType';
import { pickedLabels, setParam, toValues } from '../../../data/listFilters';

import SearchIcon from '@mui/icons-material/Search';
import { SelectOption } from '../../../data/types/SelectOption';
import { VolunteerFilters } from '../Volunteer';
import { useSearchParams } from 'react-router';
import { useState } from 'react';

const statusOptions: SelectOption[] = Object.values(VolunteerStatus).map((status) => ({
  label: volunteerStatusLabels[status],
  value: status,
}));

const typeOptions: SelectOption[] = Object.values(VolunteerType).map((type) => ({
  label: volunteerTypeLabels[type],
  value: type,
}));

const expertiseOptions: SelectOption[] = Object.values(VolunteerExpertise).map((expertise) => ({
  label: volunteerExpertiseLabels[expertise],
  value: expertise,
}));

const rolePreferenceOptions: SelectOption[] = Object.values(VolunteerAssignmentType).map((type) => ({
  label: volunteerAssignmentTypeLabels[type],
  value: type,
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

interface VolunteerFilterBarProps {
  filters: VolunteerFilters;
}

/** The search and the filters above the volunteers list, kept in the URL so Back and links bring them back. */
export const VolunteerFilterBar = ({ filters }: VolunteerFilterBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Typed into its own state, as the URL updates just after the key press and would move the caret.
  const [search, setSearch] = useState(filters.q);
  // Follows the URL when it changes elsewhere, like the sidebar link or Clear filters.
  const [urlSearch, setUrlSearch] = useState(filters.q);
  if (filters.q !== urlSearch) {
    setUrlSearch(filters.q);
    setSearch(filters.q);
  }

  // Replaces the history entry, so Back leaves the list rather than undoing a filter, and keeps the scroll position.
  // Synchronous, so a second pick in an open dropdown starts from the first one.
  const setFilter = (key: string, values: string[]) =>
    setSearchParams((params) => setParam(params, key, values), URL_UPDATE);

  const clearFilters = () => setSearchParams({}, URL_UPDATE);

  return (
    <Stack direction="row" useFlexGap sx={{ flexWrap: 'wrap', gap: 2, alignItems: 'center', mt: 3, mb: 2 }}>
      <TextField
        type="search"
        size="small"
        placeholder="Search volunteers"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setFilter('q', [event.target.value]);
        }}
        sx={{ width: 240 }}
        slotProps={{
          htmlInput: { maxLength: 100, 'aria-label': 'Search volunteers' },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />
      <TextField
        select
        size="small"
        label="Status"
        value={filters.status}
        onChange={(event) => setFilter('status', toValues(event.target.value))}
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
      <TextField
        select
        size="small"
        label="Type"
        value={filters.type}
        onChange={(event) => setFilter('type', toValues(event.target.value))}
        sx={{ width: 170 }}
        slotProps={{
          select: { multiple: true, displayEmpty: true, renderValue: () => pickedLabels(typeOptions, filters.type) },
          inputLabel: { shrink: true },
        }}
      >
        {menuItems(typeOptions, filters.type)}
      </TextField>
      <TextField
        select
        size="small"
        label="Expertise"
        value={filters.expertise}
        onChange={(event) => setFilter('expertise', toValues(event.target.value))}
        sx={{ width: 170 }}
        slotProps={{
          select: {
            multiple: true,
            displayEmpty: true,
            renderValue: () => pickedLabels(expertiseOptions, filters.expertise),
          },
          inputLabel: { shrink: true },
        }}
      >
        {menuItems(expertiseOptions, filters.expertise)}
      </TextField>
      <TextField
        select
        size="small"
        label="Role preferences"
        value={filters.rolePreference}
        onChange={(event) => setFilter('rolePreference', toValues(event.target.value))}
        sx={{ width: 170 }}
        slotProps={{
          select: {
            multiple: true,
            displayEmpty: true,
            renderValue: () => pickedLabels(rolePreferenceOptions, filters.rolePreference),
          },
          inputLabel: { shrink: true },
        }}
      >
        {menuItems(rolePreferenceOptions, filters.rolePreference)}
      </TextField>
      {searchParams.size > 0 && <Button onClick={clearFilters}>Clear filters</Button>}
    </Stack>
  );
};
