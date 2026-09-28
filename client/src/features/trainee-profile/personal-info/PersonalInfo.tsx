import {
  backgroundOptions,
  educationLevelOptions,
  englishLevelOptions,
  financialSupportOptions,
  genderOptions,
  pronounOptions,
  yesNoOptions,
} from '../utils/selectOptions';
import { createTextChangeHandler, createValueChangeHandler } from '../utils/formHelper';
import { FieldRow, PROFILE_FIELD_GAP, ProfileSection } from '../profile/components/ProfileSection';
import { PROFILE_FIELD_WIDTH, ProfileTextField } from '../profile/components/ProfileTextField';

import { ProfileDateField } from '../profile/components/ProfileDateField';
import { ProfileNumberField } from '../profile/components/ProfileNumberField';
import { ProfileSelect } from '../profile/components/ProfileSelect';
import { Stack } from '@mui/material';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

// Two fields and the gap between them, so the field lines up with the columns of the other rows.
const DOUBLE_FIELD_WIDTH = `calc(2 * ${PROFILE_FIELD_WIDTH} + ${PROFILE_FIELD_GAP})`;

// The most weekly work hours the API accepts.
const MAX_WEEKLY_WORK_HOURS = 80;

/**
 * Component for displaying and updating trainee profile data on the personal information tab.
 *
 * @returns {ReactNode} A React element that renders trainee personal information with view, add, and edit logic.
 */
const PersonalInfo = () => {
  const { trainee, setTrainee, isEditMode: isEditing } = useTraineeProfileContext();
  const { personalInfo: editedFields } = trainee;

  const handleTextChange = createTextChangeHandler(setTrainee, 'personalInfo');
  const handleValueChange = createValueChangeHandler(setTrainee, 'personalInfo');

  return (
    <Stack spacing={4} useFlexGap>
      <ProfileSection>
        <FieldRow>
          <ProfileTextField
            name="firstName"
            label="First name"
            placeholder="John"
            value={editedFields.firstName}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="lastName"
            label="Last name"
            placeholder="Doe"
            value={editedFields.lastName}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="preferredName"
            label="Preferred name"
            placeholder="Johnny"
            value={editedFields.preferredName}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
        <FieldRow>
          <ProfileDateField
            name="dateOfBirth"
            label="Date of birth"
            value={editedFields.dateOfBirth}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileSelect
            name="gender"
            label="Gender"
            options={genderOptions}
            value={editedFields.gender}
            nullable
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileSelect
            name="pronouns"
            label="Pronouns"
            options={pronounOptions}
            value={editedFields.pronouns}
            nullable
            isEditing={isEditing}
            onChange={handleValueChange}
          />
        </FieldRow>
        <FieldRow>
          <ProfileTextField
            name="location"
            label="Location"
            placeholder="Amsterdam"
            value={editedFields.location}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="esfId"
            label="ESF ID"
            value={editedFields.esfId}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
      </ProfileSection>

      <ProfileSection title="Background">
        <FieldRow>
          <ProfileSelect
            name="background"
            label="Background"
            options={backgroundOptions}
            value={editedFields.background}
            nullable
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileTextField
            name="countryOfOrigin"
            label="Country of origin"
            placeholder="Netherlands"
            value={editedFields.countryOfOrigin}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileDateField
            name="nlArrivalDate"
            label="Arrived in NL"
            value={editedFields.nlArrivalDate}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileDateField
            name="firstPermitIssueDate"
            label="First permit issued"
            value={editedFields.firstPermitIssueDate}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
        </FieldRow>
      </ProfileSection>

      <ProfileSection title="Financial">
        <FieldRow>
          <ProfileSelect
            name="financialSupport"
            label="Financial support"
            options={financialSupportOptions}
            value={editedFields.financialSupport}
            nullable
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileNumberField
            name="weeklyWorkHours"
            label="Weekly work hours"
            value={editedFields.weeklyWorkHours}
            max={MAX_WEEKLY_WORK_HOURS}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
        </FieldRow>
      </ProfileSection>

      <ProfileSection title="Education">
        <FieldRow>
          <ProfileSelect
            name="englishLevel"
            label="English level"
            options={englishLevelOptions}
            value={editedFields.englishLevel}
            nullable
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileSelect
            name="professionalDutch"
            label="Professional Dutch"
            options={yesNoOptions}
            value={editedFields.professionalDutch}
            nullable
            isEditing={isEditing}
            onChange={handleValueChange}
          />
        </FieldRow>
        <FieldRow>
          <ProfileSelect
            name="educationLevel"
            label="Education level"
            options={educationLevelOptions}
            value={editedFields.educationLevel}
            nullable
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileTextField
            name="educationBackground"
            label="Education background"
            placeholder="Computer science"
            value={editedFields.educationBackground}
            isEditing={isEditing}
            onChange={handleTextChange}
            sx={{ width: DOUBLE_FIELD_WIDTH }}
          />
        </FieldRow>
      </ProfileSection>

      <ProfileSection title="Health">
        <FieldRow fill>
          <ProfileTextField
            name="dietaryPreference"
            label="Dietary preference"
            placeholder="Vegetarian"
            multiline
            value={editedFields.dietaryPreference}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="healthCondition"
            label="Health condition"
            placeholder="Uses a wheelchair"
            multiline
            value={editedFields.healthCondition}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
      </ProfileSection>

      {/* The section title labels the field. */}
      <ProfileSection title="Comments">
        <ProfileTextField
          name="comments"
          multiline
          value={editedFields.comments}
          isEditing={isEditing}
          onChange={handleTextChange}
          sx={{ width: '100%' }}
          slotProps={{ htmlInput: { 'aria-label': 'Comments' } }}
        />
      </ProfileSection>
    </Stack>
  );
};

export default PersonalInfo;
