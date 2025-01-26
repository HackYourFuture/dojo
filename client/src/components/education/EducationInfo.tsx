import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from '@mui/material';
import { LearningStatus, QuitReason, TraineeEducationInfo } from '../../models';
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useEffect, useState } from 'react';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { LoadingButton } from '@mui/lab';
import { StrikesComponent } from './StrikesComponent';

const NoIcon = () => null;

interface EducationInfoProps {
  educationData?: TraineeEducationInfo;
  saveTraineeData: (editedData: TraineeEducationInfo) => void;
}

/**
 * Component for displaying trainee profile data on the education information tab.
 *
 * @param {TraineeEducationInfo} educationData trainee education information.
 * @param {TraineeEducationInfo} saveTraineeData callback to save edited trainee education information.
 * @returns {ReactNode} A React element that renders trainee education information with view, add, and edit logic.
 */
export const EducationInfo = ({ educationData, saveTraineeData }: EducationInfoProps) => {
  const [editedFields, setEditedFields] = useState<TraineeEducationInfo>(educationData!);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (educationData) setEditedFields(educationData as TraineeEducationInfo);
  }, [educationData]);

  /**
   * Function to enable edit mode when edit button is clicked.
   */
  const handleEditClick = () => {
    setIsEditing(true);
  };

  /**
   * Function to set editing mode to `false` when cancel button is clicked.
   */
  const handleCancelClick = () => {
    if (educationData) {
      setEditedFields(educationData);
    }
    setIsEditing(false);
  };

  /**
   * Function to handel the saving logic after clicking the save button.
   */
  const handleSaveClick = async () => {
    if (!editedFields || !educationData) return;

    const changedFields: Partial<TraineeEducationInfo> = {};
    Object.entries(editedFields).forEach(([key, value]) => {
      if (educationData[key as keyof TraineeEducationInfo] !== value) {
        changedFields[key as keyof TraineeEducationInfo] = value;
      }
    });

    const editedData: any = {
      educationInfo: {
        ...changedFields,
      },
    };

    setIsSaving(true);

    try {
      await saveTraineeData(editedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving trainee data:', error);
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Function to handel the changing text fields with edited data.
   *
   * @param {HTMLInputElement} e the event received from the text fields after editing.
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: name === 'date' ? new Date(value) : value,
    }));
  };

  /**
   * Function to handel changing select fields with edited data.
   *
   * @param {SelectChangeEvent} event the event received from select component change.
   */
  const handleSelectChange = (event: SelectChangeEvent<string | boolean | { name?: string; value: ReactNode }>) => {
    const { name, value } = event.target;
    setEditedFields((prevFields) => ({
      ...prevFields,
      [name]: value === 'true' ? true : value === 'false' ? false : value,
    }));
  };

  /**
   * Function for converting numeric values from textFields with ‘type=number’
   */
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^\d*$/.test(value)) {
      setEditedFields((prevFields) => ({
        ...prevFields,
        [name]: value,
      }));
    }
  };

  return (
    <Box display="flex" flexDirection="row" flexWrap="wrap" gap={4} padding="24px">
      <Box width={'100%'} display="flex" justifyContent={'end'}>
        <Stack direction="row" spacing={2}>
          <LoadingButton
            color="primary"
            onClick={isEditing ? handleSaveClick : handleEditClick}
            loading={isSaving}
            variant="contained"
          >
            <span>{isEditing ? 'Save' : 'Edit profile'}</span>
          </LoadingButton>
          {isEditing && <Button onClick={handleCancelClick}>Cancel</Button>}
        </Stack>
      </Box>
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
              onChange={handleChange}
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
              onChange={handleChange}
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
            onChange={handleChange}
          />
        </FormControl>
      </div>
      <StrikesComponent />
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
            onChange={handleChange}
          />
        </FormControl>
      </div>
    </Box>
  );
};

// TODO: Extract to helper file
/**
 * Function to format date value.
 *
 * @param {Date | undefined} date date value selected.
 */
export const formatDate = (date: Date | undefined) => {
  if (!date) return '';
  const formattedDate = new Date(date);
  if (isNaN(formattedDate.getTime())) {
    return date.toString();
  }
  return formattedDate.toISOString().split('T')[0];
};
