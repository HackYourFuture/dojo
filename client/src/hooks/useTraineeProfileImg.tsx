import { useQuery } from "react-query";
import axios from "axios";

export const useTraineeProfileImg = (traineeId: string) => {
  return useQuery(
    ["traineeImg", traineeId],
    async () => {
      const { data: profileImgSrc } = await axios.get(
        `/api/trainees/${traineeId}/profile-picture`
      );
      return profileImgSrc;
    }
  );
};