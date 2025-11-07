import { Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { LearningStatus, QuitReason, Trainee } from '../../models';
import { createSelectChangeHandler, createTextChangeHandler } from '../../helpers/formHelper';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import React from 'react';
import { StrikesComponent } from './StrikesComponent';
import { TestsComponent } from './TestsComponent';
import { formatDate } from '../../helpers/dateHelper';
import { useTraineeProfileContext } from '../../hooks/useTraineeProfileContext';

const NoIcon = () => null;

/**
 * Component for displaying trainee profile data on the education information tab.
 *
 * @returns {ReactNode} A React element that renders trainee education information with view, add, and edit logic.
 */
export const EducationInfo = () => {
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
            value={editedFields?.currentCohort || ''}
            InputProps={{
              readOnly: isEditing ? false : true,
              inputMode: 'numeric',
            }}
            inputProps={{
              pattern: '[0-9]*',
              maxLength: 3,
            }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleNumericChange}
          />
        </FormControl>

        {/* Learning status */}
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
              InputProps={{ readOnly: isEditing ? false : true }}
              InputLabelProps={{ shrink: true }}
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
              InputProps={{ readOnly: isEditing ? false : true }}
              InputLabelProps={{ shrink: true }}
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
            InputProps={{
              readOnly: isEditing ? false : true,
              inputMode: 'numeric',
            }}
            inputProps={{
              pattern: '[0-9]*',
              maxLength: 3,
            }}
            InputLabelProps={{ shrink: true }}
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
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </div>
      <Box display="flex" gap={2}>
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
            InputProps={{ readOnly: isEditing ? false : true }}
            InputLabelProps={{ shrink: true }}
            variant={isEditing ? 'outlined' : 'standard'}
            onChange={handleTextChange}
          />
        </FormControl>
      </div>
    </Box>
  );
};
