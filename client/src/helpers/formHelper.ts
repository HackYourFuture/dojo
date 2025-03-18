import { ChangeEvent, ReactNode } from 'react';
import { Trainee, TraineeInfoType } from '../models';

import { SelectChangeEvent } from '@mui/material';

/**
 * This function is used to handle the change event for the select component.
 * @param setTrainee a function to set the trainee object in the context
 * @param propName must be a key of the Trainee object
 * @returns
 */
export const createSelectChangeHandler = (
  setTrainee: React.Dispatch<React.SetStateAction<Trainee>>,
  propName: TraineeInfoType
) => {
  return (event: SelectChangeEvent<string | boolean | { name: string; value: ReactNode }>) => {
    const { name, value } = event.target;
    setTrainee((prevFields: Trainee) => {
      const updatedInfo = {
        ...prevFields[propName], // Update the specified prop (personalInfo, contactInfo, etc.)
        [name]: value === 'true' ? true : value === 'false' ? false : value,
      };

      return { ...prevFields, [propName]: updatedInfo }; // Update the entire Trainee object with the new prop value
    });
  };
};

/**
 * Function to handle the change event for the input component.
 * @param setTrainee a function to set the trainee object in the context
 * @param propName a key of the Trainee object
 * @returns
 */
export const createTextChangeHandler = (
  setTrainee: React.Dispatch<React.SetStateAction<Trainee>>,
  propName: TraineeInfoType
) => {
  return (event: ChangeEvent<HTMLInputElement | { name: string; value: ReactNode }>) => {
    const { name, value } = event.target;
    setTrainee((prevFields: Trainee) => {
      const updatedInfo = {
        ...prevFields[propName], // Update the specified prop (personalInfo, contactInfo, etc.)
        [name]: value,
      };

      return { ...prevFields, [propName]: updatedInfo }; // Update the entire Trainee object with the new prop value
    });
  };
};

/**
 * formats the text to a UI friendly format
 * for example: "in-progress" becomes "In progress"
 * @param value
 * @returns
 */
export const formatTextToFriendly = (value: string): string => {
  // replace '-' with ' ' in the type string and capitilzie first letter
  return value.replace(/-/g, ' ').replace(/^\w/, (char) => char.toUpperCase());
};
