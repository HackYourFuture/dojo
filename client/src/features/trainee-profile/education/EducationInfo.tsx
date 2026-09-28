import { FieldRow, ProfileSection } from '../profile/components/ProfileSection';
import { createNumberChangeHandler, createSelectChangeHandler, createTextChangeHandler } from '../utils/formHelper';
import { learningStatusOptions, quitReasonOptions, trackOptions } from '../utils/selectOptions';

import { AssessmentsComponent } from './assessments/AssessmentsComponent';
import { LearningStatus } from '../../../data/types/Trainee';
import { ProfileSelect } from '../profile/components/ProfileSelect';
import { ProfileTextField } from '../profile/components/ProfileTextField';
import { Stack } from '@mui/material';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

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
  const handleNumberChange = createNumberChangeHandler(setTrainee, 'educationInfo');
  const handleSelectChange = createSelectChangeHandler(setTrainee, 'educationInfo');

  const hasGraduated = editedFields.learningStatus === LearningStatus.Graduated;
  const hasQuit = editedFields.learningStatus === LearningStatus.Quit;

  return (
    <Stack spacing={4} useFlexGap>
      <ProfileSection>
        <FieldRow>
          <ProfileTextField
            name="currentCohort"
            label="Cohort"
            value={editedFields.currentCohort ?? (isEditing ? null : 'No cohort assigned')}
            isEditing={isEditing}
            onChange={handleNumberChange}
            slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 3 } }}
          />
          <ProfileSelect
            name="track"
            label="Track"
            options={trackOptions}
            value={editedFields.track}
            isEditing={isEditing}
            onChange={handleSelectChange}
          />
          <ProfileTextField
            name="startDate"
            label="Start date"
            type="date"
            value={editedFields.startDate}
            isEditing={isEditing}
            onChange={handleTextChange}
          />
        </FieldRow>
        <FieldRow>
          <ProfileSelect
            name="learningStatus"
            label="Learning Status"
            options={learningStatusOptions}
            value={editedFields.learningStatus}
            isEditing={isEditing}
            onChange={handleSelectChange}
          />
          {hasGraduated && (
            <ProfileTextField
              name="graduationDate"
              label="Graduation date"
              type="date"
              value={editedFields.graduationDate}
              isEditing={isEditing}
              onChange={handleTextChange}
            />
          )}
          {hasQuit && (
            <>
              <ProfileTextField
                name="quitDate"
                label="Quit date"
                type="date"
                value={editedFields.quitDate}
                isEditing={isEditing}
                onChange={handleTextChange}
              />
              <ProfileSelect
                name="quitReason"
                label="Quit reason"
                options={quitReasonOptions}
                value={editedFields.quitReason}
                isEditing={isEditing}
                onChange={handleSelectChange}
              />
            </>
          )}
        </FieldRow>
        <FieldRow>
          <ProfileTextField
            name="startCohort"
            label="Start cohort"
            value={editedFields.startCohort}
            isEditing={isEditing}
            onChange={handleNumberChange}
            slotProps={{ htmlInput: { inputMode: 'numeric', maxLength: 3 } }}
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
