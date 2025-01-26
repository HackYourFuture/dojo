import React, { createContext, useContext, useState } from 'react';

type TraineeProfileContextType = {
  traineeId: string | null;
  setTraineeId: (id: string | null) => void;
};

const TraineeProfileContext = createContext<TraineeProfileContextType>({
  traineeId: null,
  setTraineeId: () => {},
});

export const TraineeProfileProvider = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const [traineeId, setTraineeId] = useState<string | null>(id);

  return (
    <TraineeProfileContext.Provider value={{ traineeId, setTraineeId }}>{children}</TraineeProfileContext.Provider>
  );
};

export const useTraineeProfileContext = () => useContext(TraineeProfileContext);
