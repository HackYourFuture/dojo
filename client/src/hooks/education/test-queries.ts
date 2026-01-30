import { useMutation, useQuery } from '@tanstack/react-query';

import { Test } from '../../models';
import axios from 'axios';

/**
 * Hook to add a test to a trainee.
 * @param {string} traineeId the id of the trainee to add the test to.
 * @param {Test} test the test to add.
 */
export const useAddTest = (traineeId: string) => {
  return useMutation({
    mutationFn: (test: Test) => {
      return axios.post(`/api/trainees/${traineeId}/tests`, test).catch((error) => {
        throw new Error(error.response?.data?.error || 'Failed to add test');
      });
    },
  });
};

/**
 * Hook to get the tests of a trainee.
 * @param {string} traineeId the id of the trainee to get the tests from.
 * @returns {UseQueryResult<Test[], Error>} the tests of the trainee.
 */
export const useGetTests = (traineeId: string) => {
  return useQuery({
    queryKey: ['tests', traineeId],
    queryFn: async () => {
      const { data } = await axios.get<Test[]>(`/api/trainees/${traineeId}/tests`);
      return orderTestsByDateDesc(data);
    },

    enabled: !!traineeId,
    refetchOnWindowFocus: false,
  });
};

/**
 * Hook to delete a test from a trainee.
 * @param {string} traineeId the id of the trainee to delete the test from.
 * @param {string} testId the id of the test to delete.
 * */

export const useDeleteTest = (traineeId: string) => {
  return useMutation({
    mutationFn: (testId: string) => {
      return axios.delete(`/api/trainees/${traineeId}/tests/${testId}`);
    },
  });
};

/**
 * Hook to edit a test of a trainee.
 * @param {string} traineeId the id of the trainee to edit the test of.
 */
export const useEditTest = (traineeId: string) => {
  return useMutation({
    mutationFn: (test: Test) => {
      return axios.put(`/api/trainees/${traineeId}/tests/${test.id}`, test).catch((error) => {
        throw new Error(error.response?.data?.error || 'Failed to edit test');
      });
    },
  });
};

const orderTestsByDateDesc = (data: Test[]): Test[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
