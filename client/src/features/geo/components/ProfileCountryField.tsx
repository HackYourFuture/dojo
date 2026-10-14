import { CountryAutocomplete } from './CountryAutocomplete';
import { ProfileValue } from '../../../components/profile/ProfileValue';
import { profileInputStyle } from '../../../components/profile/fieldStyles';
import { useMemo } from 'react';

interface ProfileCountryFieldProps {
  name: string;
  label: string;
  value: string | null;
  placeholder?: string;
  isEditing: boolean;
  onChange: (name: string, value: string | null) => void;
}

/** A country on the profile tabs: picked from the list while editing, the label and value otherwise. */
export const ProfileCountryField = ({
  name,
  label,
  value,
  placeholder,
  isEditing,
  onChange,
}: ProfileCountryFieldProps) => {
  // Memoized, as MUI resets the typed text whenever it gets a new value object.
  const country = useMemo(() => (value ? { name: value } : null), [value]);

  if (!isEditing) {
    return <ProfileValue label={label} value={value} />;
  }

  return (
    <CountryAutocomplete
      id={name}
      label={label}
      placeholder={placeholder}
      value={country}
      onChange={(pickedCountry) => onChange(name, pickedCountry?.name ?? null)}
      sx={profileInputStyle}
    />
  );
};
