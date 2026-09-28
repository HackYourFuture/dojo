import { ChangeEvent, ReactNode } from 'react';
import { JobPath, Trainee, TraineeInfoType } from '../../../data/types/Trainee';

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
 * Like createTextChangeHandler, for the date, number and dropdown fields, which report their value instead of an event.
 */
export const createValueChangeHandler = (
  setTrainee: React.Dispatch<React.SetStateAction<Trainee>>,
  propName: TraineeInfoType
) => {
  return (name: string, value: string | number | boolean | null) => {
    setTrainee((prevFields: Trainee) => {
      const updatedInfo = {
        ...prevFields[propName],
        [name]: value,
      };

      return { ...prevFields, [propName]: updatedInfo };
    });
  };
};

/**
 * formats the text to a UI friendly format
 * for example: "in-progress" becomes "In progress"
 * @param value
 * @returns
 */
// TODO: rename this function
export const formatTextToFriendly = (value: string): string => {
  // replace '-' with ' ' in the type string and capitilzie first letter
  return value.replace(/-/g, ' ').replace(/^\w/, (char) => char.toUpperCase());
};

export const formatJobPathToLabel = (jobPath: JobPath): string => {
  if (jobPath === JobPath.NonTechJob) return 'Non-tech job';
  return formatTextToFriendly(jobPath);
};
