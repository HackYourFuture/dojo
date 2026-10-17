import { City } from '../models/city';
import { CityLabel } from './CityLabel';
import { CityAutocomplete } from './CityAutocomplete';
import { ProfileValue } from '../../../components/profile/ProfileValue';
import { profileInputStyle } from '../../../components/profile/fieldStyles';

interface ProfileCityFieldProps {
  name: string;
  label: string;
  value: City | null;
  placeholder?: string;
  isEditing: boolean;
  onChange: (city: City | null) => void;
}

/** A city on the profile tabs: picked from the list while editing, the label and name otherwise. */
export const ProfileCityField = ({ name, label, value, placeholder, isEditing, onChange }: ProfileCityFieldProps) => {
  if (!isEditing) {
    return <ProfileValue label={label} value={value && <CityLabel city={value} />} />;
  }

  return (
    <CityAutocomplete
      id={name}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      sx={profileInputStyle}
    />
  );
};
