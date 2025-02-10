import { ChangeEvent, ReactNode, useCallback } from 'react';

import { SelectChangeEvent } from '@mui/material';
import { Trainee } from '../models';

/**
 * This function is used to handle the change event for the select component.
 * @param setTrainee a function to set the trainee object in the context
 * @param propName must be a key of the Trainee object
 * @returns
 */
export const useHandleSelectChange = (
  setTrainee: React.Dispatch<React.SetStateAction<Trainee>>,
  propName: 'personalInfo' | 'contactInfo' | 'employmentInfo' | 'educationInfo'
) => {
  return useCallback(
    (event: SelectChangeEvent<string | boolean | { name: string; value: ReactNode }>) => {
      const { name, value } = event.target;

      setTrainee((prevFields: Trainee) => {
        const updatedInfo = {
          ...prevFields[propName], // Update the specified prop (personalInfo, contactInfo, etc.)
          [name]: value === 'true' ? true : value === 'false' ? false : value,
        };

        return { ...prevFields, [propName]: updatedInfo }; // Update the entire Trainee object with the new prop value
      });
    },
    [setTrainee, propName] // Re-run the effect if setTrainee or propName changes
  );
};

/**
 * Finction to handle the change event for the input component.
 * @param setTrainee a function to set the trainee object in the context
 * @param propName a key of the Trainee object
 * @returns
 */
export const useHandleTextChange = (
  setTrainee: React.Dispatch<React.SetStateAction<Trainee>>,
  propName: 'personalInfo' | 'contactInfo' | 'employmentInfo' | 'educationInfo'
) => {
  return useCallback(
    (event: ChangeEvent<HTMLInputElement | { name: string; value: ReactNode }>) => {
      const { name, value } = event.target;

      setTrainee((prevFields: Trainee) => {
        const updatedInfo = {
          ...prevFields[propName], // Update the specified prop (personalInfo, contactInfo, etc.)
          [name]: value,
        };

        return { ...prevFields, [propName]: updatedInfo }; // Update the entire Trainee object with the new prop value
      });
    },
    [setTrainee, propName] // Re-run the effect if setTrainee or propName changes
  );
};
