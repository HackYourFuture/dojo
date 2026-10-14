import { CityAutocomplete } from './CityAutocomplete';
import { ProfileValue } from '../../../components/profile/ProfileValue';
import { profileInputStyle } from '../../../components/profile/fieldStyles';
import { useMemo } from 'react';

interface ProfileCityFieldProps {
  name: string;
  label: string;
  value: string | null;
  placeholder?: string;
  isEditing: boolean;
  onChange: (name: string, value: string | null) => void;
}

/** A city on the profile tabs: picked from the list while editing, the label and value otherwise. */
export const ProfileCityField = ({ name, label, value, placeholder, isEditing, onChange }: ProfileCityFieldProps) => {
  // Memoized, as MUI resets the typed text whenever it gets a new value object.
  const city = useMemo(() => (value ? { name: value } : null), [value]);

  if (!isEditing) {
    return <ProfileValue label={label} value={value} />;
  }

  return (
    <CityAutocomplete
      id={name}
      label={label}
      placeholder={placeholder}
      value={city}
      onChange={(pickedCity) => onChange(name, pickedCity?.name ?? null)}
      sx={profileInputStyle}
    />
  );
};
