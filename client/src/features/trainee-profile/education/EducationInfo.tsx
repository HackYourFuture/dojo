import { FieldRow, ProfileSection } from '../../../components/profile/ProfileSection';
import { createTextChangeHandler, createValueChangeHandler } from '../utils/formHelper';
import { learningStatusOptions, quitReasonOptions, trackOptions } from '../utils/selectOptions';

import { AssessmentsComponent } from './assessments/AssessmentsComponent';
import { LearningStatus } from '../../../data/types/Trainee';
import { ProfileDateField } from '../profile/components/ProfileDateField';
import { ProfileNumberField } from '../profile/components/ProfileNumberField';
import { ProfileSelect } from '../../../components/profile/ProfileSelect';
import { ProfileTextField } from '../../../components/profile/ProfileTextField';
import { Stack } from '@mui/material';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

// The highest cohort number the API accepts.
const MAX_COHORT = 999;

/**
 * Component for displaying trainee profile data on the education information tab.
 *
 * @returns {ReactNode} A React element that renders trainee education information with view, add, and edit logic.
 */
const EducationInfo = () => {
  const {
    trainee: { educationInfo: editedFields },
    setTrainee,
    isEditMode: isEditing,
  } = useTraineeProfileContext();

  const handleTextChange = createTextChangeHandler(setTrainee, 'educationInfo');
  const handleValueChange = createValueChangeHandler(setTrainee, 'educationInfo');

  const hasGraduated = editedFields.learningStatus === LearningStatus.Graduated;
  const hasQuit = editedFields.learningStatus === LearningStatus.Quit;

  return (
    <Stack spacing={4} useFlexGap>
      <ProfileSection>
        <FieldRow>
          <ProfileNumberField
            name="currentCohort"
            label="Cohort"
            value={editedFields.currentCohort}
            max={MAX_COHORT}
            emptyText="No cohort assigned"
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileSelect
            name="track"
            label="Track"
            options={trackOptions}
            value={editedFields.track}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          <ProfileDateField
            name="startDate"
            label="Start date"
            value={editedFields.startDate}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
        </FieldRow>
        <FieldRow>
          <ProfileSelect
            name="learningStatus"
            label="Learning Status"
            options={learningStatusOptions}
            value={editedFields.learningStatus}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
          {hasGraduated && (
            <ProfileDateField
              name="graduationDate"
              label="Graduation date"
              value={editedFields.graduationDate}
              isEditing={isEditing}
              onChange={handleValueChange}
            />
          )}
          {hasQuit && (
            <>
              <ProfileDateField
                name="quitDate"
                label="Quit date"
                value={editedFields.quitDate}
                isEditing={isEditing}
                onChange={handleValueChange}
              />
              <ProfileSelect
                name="quitReason"
                label="Quit reason"
                options={quitReasonOptions}
                value={editedFields.quitReason}
                nullable
                isEditing={isEditing}
                onChange={handleValueChange}
              />
            </>
          )}
        </FieldRow>
        <FieldRow>
          <ProfileNumberField
            name="startCohort"
            label="Start cohort"
            value={editedFields.startCohort}
            max={MAX_COHORT}
            isEditing={isEditing}
            onChange={handleValueChange}
          />
        </FieldRow>
      </ProfileSection>

      <ProfileSection title="Mentors">
        <FieldRow>
          <ProfileTextField
            name="mentorTech"
            label="Technical Mentor"
            placeholder="John Doe"
            value={editedFields.mentorTech}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="mentorHr"
            label="HR Mentor"
            placeholder="Jane Smith"
            value={editedFields.mentorHr}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
          <ProfileTextField
            name="mentorEnglish"
            label="English Mentor"
            placeholder="John Doe"
            value={editedFields.mentorEnglish}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
      </ProfileSection>

      <AssessmentsComponent />
    </Stack>
  );
};

export default EducationInfo;
