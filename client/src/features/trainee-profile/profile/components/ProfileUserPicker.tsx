import { Autocomplete, Avatar, Box, Chip, SxProps, TextField, Theme } from '@mui/material';

import { ProfileValue } from './ProfileValue';
import { profileInputStyle } from './fieldStyles';
import { useGetUsers } from '../../../admin/users/data/user-queries';

// A user as the picker shows it, like a responsible of an organisation.
interface PickerUser {
  id: string;
  name: string;
  thumbnailUrl: string | null;
}

interface ProfileUserPickerProps {
  name: string;
  label: string;
  value: PickerUser[];
  isEditing: boolean;
  onChange: (users: PickerUser[]) => void;
  sx?: SxProps<Theme>;
}

/** Users on the profile tabs with their avatars, picked from the active users in the order they are picked. */
export const ProfileUserPicker = ({ name, label, value, isEditing, onChange, sx = [] }: ProfileUserPickerProps) => {
  // The users are only needed to pick from.
  const { data: users = [], isLoading } = useGetUsers({ enabled: isEditing });

  if (!isEditing) {
    // Spans, as the value is shown in a paragraph. The avatars have no alt text, as the names are next to them.
    const pickedUsers = (
      <Box component="span" sx={{ display: 'flex', flexWrap: 'wrap', columnGap: 2, rowGap: 0.5 }}>
        {value.map((user) => (
          <Box key={user.id} component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
            <Avatar component="span" src={user.thumbnailUrl ?? undefined} alt="" sx={{ width: 20, height: 20 }} />
            {user.name}
          </Box>
        ))}
      </Box>
    );
    return <ProfileValue label={label} value={value.length > 0 ? pickedUsers : null} sx={sx} />;
  }

  // Inactive users cannot be picked, but stay when they already are.
  const options: PickerUser[] = users
    .filter((user) => user.isActive || value.some((picked) => picked.id === user.id))
    .map((user) => ({ id: user.id, name: user.name, thumbnailUrl: user.thumbnailUrl }));

  return (
    <Autocomplete
      id={name}
      multiple
      filterSelectedOptions
      disableCloseOnSelect
      size="small"
      options={options}
      value={value}
      loading={isLoading}
      getOptionLabel={(user) => user.name}
      getOptionKey={(user) => user.id}
      isOptionEqualToValue={(option, user) => option.id === user.id}
      onChange={(_, selected) => onChange(selected)}
      renderOption={({ key, ...optionProps }, user) => (
        <li key={key} {...optionProps}>
          <Avatar src={user.thumbnailUrl ?? undefined} alt="" sx={{ width: 24, height: 24, marginRight: 1.5 }} />
          {user.name}
        </li>
      )}
      renderValue={(selected, getItemProps) =>
        selected.map((user, index) => {
          const { key, ...itemProps } = getItemProps({ index });
          return (
            <Chip
              key={key}
              {...itemProps}
              size="small"
              avatar={<Avatar src={user.thumbnailUrl ?? undefined} alt="" />}
              label={user.name}
            />
          );
        })
      }
      sx={[profileInputStyle, ...(Array.isArray(sx) ? sx : [sx])]}
      renderInput={(params) => (
        // Keeps the label props of the Autocomplete, which link the label to the input.
        <TextField
          {...params}
          label={label}
          slotProps={{ ...params.slotProps, inputLabel: { ...params.slotProps.inputLabel, shrink: true } }}
        />
      )}
    />
  );
};
