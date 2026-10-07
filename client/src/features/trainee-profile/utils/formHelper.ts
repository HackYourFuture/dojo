import { JobPath, Trainee, TraineeInfoType } from '../../../data/types/Trainee';

import { ChangeEvent } from 'react';
import { formatTextToFriendly } from '../../../data/text';

/**
 * Creates the change handler of the date, number and dropdown fields, which report their value instead of an event.
 * @param setTrainee a function to set the trainee object in the context
 * @param propName a key of the Trainee object
 */
export const createValueChangeHandler = (
  setTrainee: React.Dispatch<React.SetStateAction<Trainee>>,
  propName: TraineeInfoType
) => {
  return (name: string, value: string | number | boolean | null) => {
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
 * Like createValueChangeHandler, for the text fields, which report a change event.
 */
export const createTextChangeHandler = (
  setTrainee: React.Dispatch<React.SetStateAction<Trainee>>,
  propName: TraineeInfoType
) => {
  const handleValueChange = createValueChangeHandler(setTrainee, propName);
  return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    handleValueChange(event.target.name, event.target.value);
};

export const formatJobPathToLabel = (jobPath: JobPath): string => {
  if (jobPath === JobPath.NonTechJob) return 'Non-tech job';
  return formatTextToFriendly(jobPath);
};
