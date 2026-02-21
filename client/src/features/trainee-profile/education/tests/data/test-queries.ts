import { addTest, deleteTest, editTest, getTests } from '../api/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { Test } from '../../../../../data/types/Trainee';
import { testsQueryKeys } from './keys';

/**
 * Hook to add a test to a trainee.
 * @param {string} traineeId the id of the trainee to add the test to.
 * @param {Test} test the test to add.
 */
export const useAddTest = (traineeId: string) => {
  return useMutation({
    mutationFn: (test: Test) => addTest(traineeId, test),
  });
};

/**
 * Hook to get the tests of a trainee.
 * @param {string} traineeId the id of the trainee to get the tests from.
 * @returns {UseQueryResult<Test[], Error>} the tests of the trainee.
 */
export const useGetTests = (traineeId: string) => {
  return useQuery({
    queryKey: testsQueryKeys.list(traineeId),
    queryFn: async () => {
      const data = await getTests(traineeId);
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (testId: string) => deleteTest(traineeId, testId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testsQueryKeys.list(traineeId) });
    },
  });
};

/**
 * Hook to edit a test of a trainee.
 * @param {string} traineeId the id of the trainee to edit the test of.
 */
export const useEditTest = (traineeId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (test: Test) => editTest(traineeId, test),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: testsQueryKeys.list(traineeId) });
    },
  });
};

const orderTestsByDateDesc = (data: Test[]): Test[] => {
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
