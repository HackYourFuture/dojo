import { Button, Checkbox, InputAdornment, ListItemText, MenuItem, Stack, TextField } from '@mui/material';
import { jobPathOptions, learningStatusOptions } from '../../trainee-profile/utils/selectOptions';
import { pickedLabels, setParam, toApiEnumName, toValues } from '../../../data/listFilters';

import { NumberField } from '../../../components/NumberField';
import SearchIcon from '@mui/icons-material/Search';
import { SelectOption } from '../../../data/types/SelectOption';
import { TraineeFilters } from '../models/trainee-summary';
import { provinceOptions } from '../../geo/provinces';
import { useSearchParams } from 'react-router';
import { useState } from 'react';

const statusOptions: SelectOption[] = learningStatusOptions.map((option) => ({
  ...option,
  value: toApiEnumName(option.value),
}));

const jobPathFilterOptions: SelectOption[] = jobPathOptions.map((option) => ({
  ...option,
  value: toApiEnumName(option.value),
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

interface TraineeFilterBarProps {
  filters: TraineeFilters;
}

/** The search and the filters above the trainees list, kept in the URL so Back and links bring them back. */
export const TraineeFilterBar = ({ filters }: TraineeFilterBarProps) => {
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
        placeholder="Search trainees"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setFilter('q', [event.target.value]);
        }}
        sx={{ width: 240 }}
        slotProps={{
          htmlInput: { maxLength: 100, 'aria-label': 'Search trainees' },
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
        label="Job path"
        value={filters.jobPath}
        onChange={(event) => setFilter('jobPath', toValues(event.target.value))}
        sx={{ width: 170 }}
        slotProps={{
          select: {
            multiple: true,
            displayEmpty: true,
            renderValue: () => pickedLabels(jobPathFilterOptions, filters.jobPath),
          },
          inputLabel: { shrink: true },
        }}
      >
        {menuItems(jobPathFilterOptions, filters.jobPath)}
      </TextField>
      <TextField
        select
        size="small"
        label="Province"
        value={filters.province}
        onChange={(event) => setFilter('province', toValues(event.target.value))}
        sx={{ width: 170 }}
        slotProps={{
          select: {
            multiple: true,
            displayEmpty: true,
            renderValue: () => pickedLabels(provinceOptions, filters.province),
          },
          inputLabel: { shrink: true },
        }}
      >
        {menuItems(provinceOptions, filters.province)}
      </TextField>
      <NumberField
        id="startCohort"
        label="From cohort"
        value={filters.startCohort}
        placeholder="Any"
        onValueChange={(cohort) => setFilter('startCohort', cohort === null ? [] : [String(cohort)])}
        sx={{ width: 110 }}
      />
      <NumberField
        id="endCohort"
        label="To cohort"
        value={filters.endCohort}
        placeholder="Any"
        onValueChange={(cohort) => setFilter('endCohort', cohort === null ? [] : [String(cohort)])}
        sx={{ width: 110 }}
      />
      {searchParams.size > 0 && <Button onClick={clearFilters}>Clear filters</Button>}
    </Stack>
  );
};
