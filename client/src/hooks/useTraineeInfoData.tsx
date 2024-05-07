import { useQuery } from "react-query";
import axios from "axios";
import { TraineeInfo } from "../types";

export const useTraineeInfoData = (traineeId: string) => {
  return useQuery<TraineeInfo, Error>(
    ["traineeInfo", traineeId],
    async () => {
      const { data } = await axios.get<TraineeInfo>(
        `/api/trainees/${traineeId}`
      );
      return data;
    },
    {
      enabled: !!traineeId,
      //Added because it keeps rendering
      refetchOnMount: false, // Prevent refetching on component mount
      refetchOnWindowFocus: false, // Prevent refetching on window focus
    }
  );
};
