import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { LearningStatus, QuitReason, Trainee } from '../../../data/types/Trainee';
import { createSelectChangeHandler, createTextChangeHandler } from '../utils/formHelper';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { LearningStatusSelect } from '../profile/components/LearningStatusSelect';
import React from 'react';
import { StrikesComponent } from './strikes/StrikesComponent';
import { TestsComponent } from './tests/TestsComponent';
import { formatDate } from '../utils/dateHelper';
import { useTraineeProfileContext } from '../context/useTraineeProfileContext';

const NoIcon = () => null;

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
  const handleSelectChange = createSelectChangeHandler(setTrainee, 'educationInfo');

  /**
   * Function for converting numeric values from textFields with ‘type=number’
   */
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setTrainee((prevFields: Trainee) => {
        return {
          ...prevFields,
          educationInfo: {
            ...prevFields.educationInfo,
            [name]: value,
          },
        };
      });
    }
  };

  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={4} padding="24px">
      <div style={{ width: '100%' }}>
        {/* Cohort */}
        <FormControl sx={{ mx: 2, my: 1, width: '11ch', gap: '2rem' }}>
          <TextField
            id="currentCohort"
            name="currentCohort"
            label="Cohort"
            value={editedFields?.currentCohort ?? 'No cohort assigned'}
            slotProps={{
              input: {
                readOnly: isEditing ? false : true,
                inputMode: 'numeric',
              },
              inputLabel: { shrink: true },
            }}
            inputProps={{
              pattern: '[0-9]*',
              maxLength: 3,
            }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleNumericChange}
          />
        </FormControl>

        {/* Learning status */}
        <LearningStatusSelect isEditing={isEditing} value={editedFields.learningStatus} onChange={handleSelectChange} />

        <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '20ch', gap: '2rem' }}>
          <InputLabel htmlFor="learningStatus">Learning status</InputLabel>
          <Select
            name="learningStatus"
            id="learningStatus"
            label="Learning status"
            value={editedFields?.learningStatus || ''}
            inputProps={{ readOnly: isEditing ? false : true }}
            IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
            startAdornment=" "
            onChange={handleSelectChange}
          >
            <MenuItem value={LearningStatus.Studying}>Studying</MenuItem>
            <MenuItem value={LearningStatus.Graduated}>Graduated</MenuItem>
            <MenuItem value={LearningStatus.OnHold}>On hold</MenuItem>
            <MenuItem value={LearningStatus.Quit}>Quit</MenuItem>
          </Select>
        </FormControl>

        {/* Quit date */}
        {editedFields?.learningStatus === LearningStatus.Quit && (
          <FormControl sx={{ mx: 2, my: 1, width: '20ch', gap: '2rem' }}>
            <TextField
              id={editedFields?.quitDate ? 'quitDate' : 'dateEmpty'}
              name="quitDate"
              label="Quit date"
              type="date"
              value={formatDate(editedFields?.quitDate)}
              slotProps={{
                input: { readOnly: isEditing ? false : true },
                inputLabel: { shrink: true },
              }}
              variant={isEditing ? 'outlined' : 'standard'}
              onChange={handleTextChange}
            />
          </FormControl>
        )}

        {/* Quit reason */}
        {editedFields?.learningStatus === LearningStatus.Quit && (
          <FormControl variant={isEditing ? 'outlined' : 'standard'} sx={{ mx: 2, my: 1, width: '20ch', gap: '2rem' }}>
            <InputLabel htmlFor="quitReason">Quit reason</InputLabel>
            <Select
              name="quitReason"
              id="quitReason"
              label="Quit reason"
              value={editedFields?.quitReason || ''}
              inputProps={{ readOnly: isEditing ? false : true }}
              IconComponent={isEditing ? ArrowDropDownIcon : NoIcon}
              startAdornment=" "
              onChange={handleSelectChange}
            >
              <MenuItem value={QuitReason.Technical}>Technical</MenuItem>
              <MenuItem value={QuitReason.SocialSkills}>Social skills</MenuItem>
              <MenuItem value={QuitReason.Personal}>Personal</MenuItem>
              <MenuItem value={QuitReason.MunicipalityOrMonetary}>Municipality or monetary</MenuItem>
              <MenuItem value={QuitReason.LeftNL}>Left NL</MenuItem>
              <MenuItem value={QuitReason.Withdrawn}>Withdrawn</MenuItem>
              <MenuItem value={QuitReason.Other}>Other</MenuItem>
            </Select>
          </FormControl>
        )}

        {/* Graduation date */}
        {editedFields?.learningStatus === LearningStatus.Graduated && (
          <FormControl sx={{ mx: 2, my: 1, width: '20ch', gap: '2rem' }}>
            <TextField
              id={editedFields?.graduationDate ? 'graduationDate' : 'dateEmpty'}
              name="graduationDate"
              label="Graduation date"
              type="date"
              value={formatDate(editedFields?.graduationDate)}
              slotProps={{ input: { readOnly: isEditing ? false : true }, inputLabel: { shrink: true } }}
              variant={isEditing ? 'outlined' : 'standard'}
              onChange={handleTextChange}
            />
          </FormControl>
        )}
      </div>
      <div style={{ width: '100%' }}>
        {/* Start Cohort */}
        <FormControl sx={{ mx: 2, my: 1, width: '11ch', gap: '2rem' }}>
          <TextField
            id="startCohort"
            name="startCohort"
            label="Start cohort"
            value={editedFields?.startCohort || ''}
            slotProps={{
              input: {
                readOnly: isEditing ? false : true,
                inputMode: 'numeric',
              },
              inputLabel: { shrink: true },
            }}
            inputProps={{
              pattern: '[0-9]*',
              maxLength: 3,
            }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleNumericChange}
          />
        </FormControl>

        {/* Start date */}
        <FormControl sx={{ mx: 2, my: 1, width: '20ch', gap: '2rem' }}>
          <TextField
            id={editedFields?.startDate ? 'startDate' : 'dateEmpty'}
            name="startDate"
            label="Start date"
            type="date"
            value={formatDate(editedFields?.startDate)}
            slotProps={{ input: { readOnly: isEditing ? false : true }, inputLabel: { shrink: true } }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </div>
      <div style={{ width: '100%' }}>
        <Typography variant="h6" padding="16px">
          Mentors
        </Typography>

        <Box display="flex" flexWrap="wrap" style={{ maxWidth: '85%' }}>
          {/* Technical mentor */}
          <FormControl sx={{ mx: 2, my: 1, width: '30ch', gap: '2rem' }}>
            <TextField
              id="techMentor"
              name="techMentor"
              label="Technical Mentor"
              type="text"
              value={editedFields?.techMentor ?? ''}
              slotProps={{ input: { readOnly: isEditing ? false : true }, inputLabel: { shrink: true } }}
              variant={isEditing ? 'outlined' : 'standard'}
              onChange={handleTextChange}
            />
          </FormControl>

          {/* HR Mentor */}
          <FormControl sx={{ mx: 2, my: 1, width: '30ch', gap: '2rem' }}>
            <TextField
              id="hrMentor"
              name="hrMentor"
              label="HR Mentor"
              type="text"
              value={editedFields?.hrMentor ?? ''}
              slotProps={{ input: { readOnly: isEditing ? false : true }, inputLabel: { shrink: true } }}
              variant={isEditing ? 'outlined' : 'standard'}
              onChange={handleTextChange}
            />
          </FormControl>

          {/* English mentor */}
          <FormControl sx={{ mx: 2, my: 1, width: '30ch', gap: '2rem' }}>
            <TextField
              id="englishMentor"
              name="englishMentor"
              label="English Mentor"
              type="text"
              value={editedFields?.englishMentor ?? ''}
              slotProps={{ input: { readOnly: isEditing ? false : true }, inputLabel: { shrink: true } }}
              variant={isEditing ? 'outlined' : 'standard'}
              onChange={handleTextChange}
            />
          </FormControl>
        </Box>
      </div>
      <Box display="flex" gap={2} style={{ width: '100%' }}>
        <StrikesComponent />
        <TestsComponent />
      </Box>
      <div style={{ width: '100%' }}>
        {/* Comments */}
        <FormControl sx={{ mx: 2, width: '81ch' }}>
          <TextField
            id="comments"
            name="comments"
            label="Comments"
            type="text"
            multiline
            value={editedFields?.comments || ''}
            slotProps={{ input: { readOnly: isEditing ? false : true }, inputLabel: { shrink: true } }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </div>
    </Box>
  );
};
export default EducationInfo;
