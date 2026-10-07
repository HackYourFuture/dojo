import { NumberField } from '../../../../components/NumberField';
import { ProfileValue } from '../../../../components/profile/ProfileValue';
import { profileInputStyle } from '../../../../components/profile/fieldStyles';

interface ProfileNumberFieldProps {
  name: string;
  label: string;
  value: number | null;
  max?: number;
  // Shown instead of an empty value when not editing.
  emptyText?: string;
  isEditing: boolean;
  onChange: (name: string, value: number | null) => void;
}

/**
 * A whole number on the profile tabs: the number field while editing, the label and value otherwise.
 */
export const ProfileNumberField = ({
  name,
  label,
  value,
  max,
  emptyText,
  isEditing,
  onChange,
}: ProfileNumberFieldProps) => {
  if (!isEditing) {
    return <ProfileValue label={label} value={value} emptyText={emptyText} />;
  }

  return (
    <NumberField
      id={name}
      label={label}
      value={value}
      max={max}
      onValueChange={(newValue) => onChange(name, newValue)}
      sx={profileInputStyle}
    />
  );
};
