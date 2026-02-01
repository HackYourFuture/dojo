import React, { createContext, useContext } from 'react';

import { SaveTraineeRequestData } from '../personal-info/data/useTraineeInfoData';
import { Trainee } from '../../../data/types/Trainee';

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

export const TraineeProfileContext = createContext<TraineeProfileContextType>({
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

export const useTraineeProfileContext = () => useContext(TraineeProfileContext);
