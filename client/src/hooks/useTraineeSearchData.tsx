import { useQuery } from "react-query";
import axios from "axios";
import { SearchResult } from "../types";

export const useTraineeSearchData = (search: string) => {
  return useQuery(
    ["search-results", search],
    () => {
      return axios.get(`/api/search?q=${search}`);
    },
    {
      select: (data) => {
        const trainees = data.data.hits.data.map(
          (trainee: SearchResult) => trainee
        );
        return trainees;
      },
    }
  );
};
