import React, { createContext, useContext, useEffect, useState } from 'react';
import { Trainee, TraineePersonalInfo } from '../models';

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
  const getTraineeInfoChanges = (originalTraineeData: Trainee): SaveTraineeRequestData => {
    const personalInfoChanges: Partial<TraineePersonalInfo> = {};

    // Compare every key of the state object, with the original trainee data
    // return only the changed fields
    Object.entries(trainee.personalInfo).forEach(([key, value]) => {
      if (originalTraineeData.personalInfo[key as keyof TraineePersonalInfo] !== value) {
        personalInfoChanges[key as keyof TraineePersonalInfo] = value;
      }
    });

    const editedData: any = {
      personalInfo: {
        ...personalInfoChanges,
      },
    };

    return editedData;
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
