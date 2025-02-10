import { ContactInfo, EducationInfo, EmploymentInfo } from '../components';
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  Trainee,
  TraineeContactInfo,
  TraineeEducationInfo,
  TraineeEmploymentInfo,
  TraineePersonalInfo,
} from '../models';

import { SaveTraineeRequestData } from './useTraineeInfoData';

export type TraineeProfileContextType = {
  traineeId: string;
  setTraineeId: React.Dispatch<React.SetStateAction<string>>;
  trainee: Trainee;
  setTrainee: React.Dispatch<React.SetStateAction<Trainee>>;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  isSavingProfile: boolean;
  setIsSavingProfile: React.Dispatch<React.SetStateAction<boolean>>;
  getTraineeInfoChanges: (trainee: Trainee) => SaveTraineeRequestData;
};

const TraineeProfileContext = createContext<TraineeProfileContextType>({
  traineeId: '',
  trainee: {} as Trainee,
  setTrainee: () => {},
  setTraineeId: () => {},
  isEditMode: false,
  setIsEditMode: () => {},
  isSavingProfile: false,
  setIsSavingProfile: () => {},
  getTraineeInfoChanges: () => ({}) as SaveTraineeRequestData,
});

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

  // recieves trainee objects and compares to the edited fields
  const getTraineeInfoChanges = (): SaveTraineeRequestData => {
    // // Compare every key of the state object, with the original trainee data
    // // return only the changed fields

    const editedData = {
      personalInfo: getChangedFields('personalInfo'),
      contactInfo: getChangedFields('contactInfo'),
      educationInfo: getChangedFields('educationInfo'),
      employmentInfo: getChangedFields('employmentInfo'),
    };

    return editedData;
  };
  const getChangedFields = <T extends object>(keyName: keyof Trainee): Partial<T> => {
    const updatedFields: Partial<T> = {};
    // Compare every key of the state object, with the original trainee data
    // return only the changed fields
    Object.entries(trainee[keyName]).forEach(([key, value]) => {
      const typedKey = key as string;
      if (originalTrainee[keyName][typedKey] !== value) {
        updatedFields[typedKey as keyof T] = value as T[keyof T];
      }
    });

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

export const useTraineeProfileContext = () => useContext(TraineeProfileContext);
