import React, { createContext, useContext, useState } from 'react';

type TraineeProfileContextType = {
  traineeId: string;
  setTraineeId: (id: string) => void;
};

const TraineeProfileContext = createContext<TraineeProfileContextType>({
  traineeId: '',
  setTraineeId: () => {},
});

export const TraineeProfileProvider = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const [traineeId, setTraineeId] = useState<string>(id);

  return (
    <TraineeProfileContext.Provider value={{ traineeId, setTraineeId }}>{children}</TraineeProfileContext.Provider>
  );
};

export const useTraineeProfileContext = () => useContext(TraineeProfileContext);
