import React, { useState } from 'react';
import {
  Trainee,
  TraineeContactInfo,
  TraineeEducationInfo,
  TraineeEmploymentInfo,
  TraineePersonalInfo,
} from '../../../data/types/Trainee';

import { TraineeProfileContext } from './useTraineeProfileContext';
import { UpdateTraineeRequestData } from '../personal-info/data/useTraineeInfoData';

type TraineeInfoType = TraineePersonalInfo | TraineeContactInfo | TraineeEmploymentInfo | TraineeEducationInfo;

export const TraineeProfileProvider = ({
  id,
  originalTrainee,
  children,
}: {
  id: string;
  originalTrainee: Trainee;
  children: React.ReactNode;
}) => {
  const [traineeId, setTraineeId] = useState<string>(id);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [trainee, setTrainee] = useState<Trainee>(originalTrainee);

  const setIsEditMode = (isEditMode: boolean) => {
    setIsEditing(isEditMode);
  };

  /**
   * Function to get the changes made to the trainee's profile (every tab)
   * @returns  {UpdateTraineeRequestData} - Object with the changes made to the trainee's profile.
   *                                     The object is structured as follows: { personalInfo, contactInfo, educationInfo, employmentInfo }
   */
  const getTraineeInfoChanges = (): UpdateTraineeRequestData => {
    const personalInfo: Partial<TraineePersonalInfo> | null = getChangedFields(
      originalTrainee.personalInfo,
      trainee.personalInfo
    );
    const contactInfo: Partial<TraineeContactInfo> | null = getChangedFields(
      originalTrainee.contactInfo,
      trainee.contactInfo
    );
    const employmentInfo: Partial<TraineeEmploymentInfo> | null = getChangedFields(
      originalTrainee.employmentInfo,
      trainee.employmentInfo
    );
    const educationInfo: Partial<TraineeEducationInfo> | null = getChangedFields(
      originalTrainee.educationInfo,
      trainee.educationInfo
    );

    const dataToSave: UpdateTraineeRequestData = {};

    // add the changed fields to the dataToSave object if not null
    if (personalInfo) dataToSave.personalInfo = personalInfo;
    if (contactInfo) dataToSave.contactInfo = contactInfo;
    if (educationInfo) dataToSave.educationInfo = educationInfo;
    if (employmentInfo) dataToSave.employmentInfo = employmentInfo;

    return dataToSave;
  };

  /**
   * This function is used to get the fields that have been changed in the trainee's profile.
   * It loops over the edited object and compares it to the original object.
   * If the value of a field has changed, it will be added to the updatedFields object.
   * Some of the properties are ignored while comparing, because they are edited in a different way.
   *
   * @param orig info before editing (personalInfo, contactInfo, employmentInfo, educationInfo)
   * @param edited editted data (personalInfo, contactInfo, employmentInfo, educationInfo)
   * @returns
   */
  const getChangedFields = <T extends TraineeInfoType>(orig: T, edited: T) => {
    const updatedFields: Partial<T> = {};

    // These props exist on the Trainee but should not be included in the changes
    const ignoredProps = ['strikes', 'assignments', 'tests', 'employmentHistory'];

    Object.entries(edited).forEach(([key, value]) => {
      const typedKey = key as keyof T;
      if (ignoredProps.includes(key)) return;

      if (orig[typedKey] !== value) {
        updatedFields[typedKey] = value;
      }
    });

    if (Object.keys(updatedFields).length === 0) return null;
    return updatedFields;
  };

  return (
    <TraineeProfileContext.Provider
      value={{
        traineeId,
        setTraineeId,
        trainee,
        setTrainee,
        isEditMode: isEditing,
        isSavingProfile,
        setIsSavingProfile,
        setIsEditMode,
        getTraineeInfoChanges,
      }}
    >
      {children}
    </TraineeProfileContext.Provider>
  );
};
