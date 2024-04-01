import { useQuery } from "react-query";
import axios from "axios";

export const useTraineeInfoData = (traineeId: string) => {
  return useQuery(["trainee-info", traineeId], () => {
    return axios.get(`/api/trainees/${traineeId}`);
  });
};
