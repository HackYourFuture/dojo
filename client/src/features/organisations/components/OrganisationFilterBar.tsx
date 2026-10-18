import { Button, Checkbox, InputAdornment, ListItemText, MenuItem, Stack, TextField } from '@mui/material';
import { OrganisationFilters, PartnershipType } from '../Organisation';
import { pickedLabels, setParam, toValues } from '../../../data/listFilters';

import SearchIcon from '@mui/icons-material/Search';
import { SelectOption } from '../../../data/types/SelectOption';
import { organisationStatusOptions } from '../utils/organisationStatus';
import { partnershipTypeLabels } from '../utils/partnershipTypes';
import { provinceOptions } from '../../geo/provinces';
import { useGetUsers } from '../../admin/users/data/user-queries';
import { useSearchParams } from 'react-router';
import { useState } from 'react';

const partnershipOptions: SelectOption[] = Object.values(PartnershipType).map((type) => ({
  label: partnershipTypeLabels[type],
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

interface OrganisationFilterBarProps {
  filters: OrganisationFilters;
}

/** The search and the filters above the organisations list, kept in the URL so Back and links bring them back. */
export const OrganisationFilterBar = ({ filters }: OrganisationFilterBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Typed into its own state, as the URL updates just after the key press and would move the caret.
  const [search, setSearch] = useState(filters.q);
  // Follows the URL when it changes elsewhere, like the sidebar link or Clear filters.
  const [urlSearch, setUrlSearch] = useState(filters.q);
  if (filters.q !== urlSearch) {
    setUrlSearch(filters.q);
    setSearch(filters.q);
  }
  const { data: users = [] } = useGetUsers();

  // Inactive users are left out, unless the URL already picks them.
  const responsibleOptions: SelectOption[] = users
    .filter((user) => user.isActive || filters.responsibleId.includes(user.id))
    .map((user) => ({ label: user.name, value: user.id }));

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
        placeholder="Search organisations"
        value={search}
        onChange={(event) => {
          setSearch(event.target.value);
          setFilter('q', [event.target.value]);
        }}
        sx={{ width: 240 }}
        slotProps={{
          htmlInput: { maxLength: 100, 'aria-label': 'Search organisations' },
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
            renderValue: () => pickedLabels(organisationStatusOptions, filters.status),
          },
          inputLabel: { shrink: true },
        }}
      >
        {menuItems(organisationStatusOptions, filters.status)}
      </TextField>
      <TextField
        select
        size="small"
        label="Responsible"
        value={filters.responsibleId}
        onChange={(event) => setFilter('responsibleId', toValues(event.target.value))}
        sx={{ width: 170 }}
        slotProps={{
          select: {
            multiple: true,
            displayEmpty: true,
            renderValue: () => pickedLabels(responsibleOptions, filters.responsibleId),
          },
          inputLabel: { shrink: true },
        }}
      >
        {menuItems(responsibleOptions, filters.responsibleId)}
      </TextField>
      <TextField
        select
        size="small"
        label="Partnership"
        value={filters.partnership}
        onChange={(event) => setFilter('partnership', toValues(event.target.value))}
        sx={{ width: 170 }}
        slotProps={{
          select: {
            multiple: true,
            displayEmpty: true,
            renderValue: () => pickedLabels(partnershipOptions, filters.partnership),
          },
          inputLabel: { shrink: true },
        }}
      >
        {menuItems(partnershipOptions, filters.partnership)}
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
      {searchParams.size > 0 && <Button onClick={clearFilters}>Clear filters</Button>}
    </Stack>
  );
};
