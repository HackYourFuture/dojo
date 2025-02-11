import { ChangeEvent, ReactNode, useCallback } from 'react';

import { Trainee } from '../models';

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
