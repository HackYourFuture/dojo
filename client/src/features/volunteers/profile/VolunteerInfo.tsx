import { Dispatch, SetStateAction } from 'react';
import { FieldRow, PROFILE_DOUBLE_FIELD_WIDTH, ProfileSection } from '../../../components/profile/ProfileSection';
import { VolunteerStatus, volunteerStatusLabels } from '../VolunteerStatus';
import { genderOptions, pronounOptions } from '../../../data/types/Person';

import { ProfileNotes } from '../../../components/profile/ProfileNotes';
import { ProfileSelect } from '../../../components/profile/ProfileSelect';
import { ProfileTextField } from '../../../components/profile/ProfileTextField';
import { Stack } from '@mui/material';
import { Volunteer } from '../Volunteer';
import { createFieldChangeHandlers } from '../../../components/profile/fieldChangeHandlers';

// The rows are four fields wide, and a wide field takes two of them, so the fields line up in columns.
const doubleFieldStyle = { width: PROFILE_DOUBLE_FIELD_WIDTH };

// The options of the status dropdown.
const statusOptions = Object.values(VolunteerStatus).map((status) => ({
  label: volunteerStatusLabels[status],
  value: status,
}));

interface VolunteerInfoProps {
  volunteer: Volunteer;
  setVolunteer: Dispatch<SetStateAction<Volunteer>>;
  isEditing: boolean;
}

/** The overview tab: the volunteer's details, work and notes, edited with the profile. */
const VolunteerInfo = ({ volunteer, setVolunteer, isEditing }: VolunteerInfoProps) => {
  const { handleValueChange, handleTextChange } = createFieldChangeHandlers(setVolunteer);

  return (
    <Stack spacing={4} useFlexGap>
      <ProfileSection>
        <FieldRow>
          <ProfileTextField
            name="firstName"
            label="First name"
            placeholder="Jane"
            value={volunteer.firstName}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="lastName"
            label="Last name"
            placeholder="Roe"
            value={volunteer.lastName}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileSelect
            name="status"
            label="Status"
            options={statusOptions}
            value={volunteer.status}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
        </FieldRow>
        <FieldRow>
          <ProfileSelect
            name="gender"
            label="Gender"
            options={genderOptions}
            value={volunteer.gender}
            nullable
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileSelect
            name="pronouns"
            label="Pronouns"
            options={pronounOptions}
            value={volunteer.pronouns}
            nullable
            isEditing={isEditing}
            onChange={handleValueChange}
          />
        </FieldRow>
      </ProfileSection>

      <ProfileSection title="Work">
        <FieldRow>
          <ProfileTextField
            name="companyName"
            label="Company"
            placeholder="Acme B.V."
            value={volunteer.companyName}
            isEditing={isEditing}
            onChange={handleTextChange}
            sx={doubleFieldStyle}
          />
          <ProfileTextField
            name="jobRole"
            label="Job role"
            placeholder="Senior Developer"
            value={volunteer.jobRole}
            isEditing={isEditing}
            onChange={handleTextChange}
            sx={doubleFieldStyle}
          />
        </FieldRow>
      </ProfileSection>

      <ProfileNotes notes={volunteer.notes} isEditing={isEditing} onChange={handleTextChange} />
    </Stack>
  );
};

export default VolunteerInfo;
