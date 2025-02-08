import React, { createContext, useContext, useState } from 'react';
import { Trainee, TraineePersonalInfo } from '../models';

import { SaveTraineeRequestData } from './useTraineeInfoData';

export type TraineeProfileContextType = {
  traineeId: string;
  setTraineeId: (id: string) => void;
  isEditMode: boolean;
  setIsEditMode: (isEditMode: boolean) => void;
  isSavingProfile: boolean;
  setIsSavingProfile: (isSavingProfile: boolean) => void;
  personalInfo: TraineePersonalInfo | null;
  setPersonalInfo: (
    personalInfo: TraineePersonalInfo | ((prevFields: TraineePersonalInfo) => TraineePersonalInfo)
  ) => void;
  getTraineeInfoChanges: (trainee: Trainee) => SaveTraineeRequestData;
};

const TraineeProfileContext = createContext<TraineeProfileContextType>({
  traineeId: '',
  setTraineeId: () => {},
  isEditMode: false,
  setIsEditMode: () => {},
  isSavingProfile: false,
  setIsSavingProfile: () => {},
  personalInfo: null,
  setPersonalInfo: () => {},
  getTraineeInfoChanges: () => ({}) as SaveTraineeRequestData,
});

export const TraineeProfileProvider = ({
  id,
  // trainee,
  children,
}: {
  id: string;
  // trainee: Trainee;
  children: React.ReactNode;
}) => {
  const [traineeId, setTraineeId] = useState<string>(id);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSavingProfile, setIsSavingProfile] = useState<boolean>(false);
  const [personalInfo, setPersonalInfo] = useState<TraineePersonalInfo | null>(null);
  // const [contactInfo, setContactInfo] = useState<TraineeContactInfo>(trainee.contactInfo);

  const setIsEditMode = (isEditMode: boolean) => {
    setIsEditing(isEditMode);
  };

  // recieves trainee objects and compares to the edited fields
  const getTraineeInfoChanges = (originalTraineeData: Trainee): SaveTraineeRequestData => {
    if (!personalInfo) {
      // meaning no changes were made
      return { personalInfo: originalTraineeData.personalInfo };
    }

    const personalInfoChanges: Partial<TraineePersonalInfo> = {};

    // Compare every key of the state object, with the original trainee data
    // return only the changed fields
    Object.entries(personalInfo).forEach(([key, value]) => {
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
        isEditMode: isEditing,
        setIsEditMode,
        isSavingProfile,
        setIsSavingProfile,
        personalInfo,
        setPersonalInfo,
        getTraineeInfoChanges,
      }}
    >
      {children}
    </TraineeProfileContext.Provider>
  );
};

export const useTraineeProfileContext = () => useContext(TraineeProfileContext);
