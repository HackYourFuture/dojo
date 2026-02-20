import { useMutation } from '@tanstack/react-query';
import { EmploymentHistory } from '../../../../data/types/Trainee'
import { addEmployment, deleteEmployment, editEmployment } from '../api/api';

/**
 * Hook to add employment to a trainee.
 * @param {string} traineeId the id of the trainee to add the employment to.
 * @param {EmploymentHistory} employment the employment to add.
 */
export const useAddEmploymentHistory = (traineeId: string) => {
  return useMutation({
    mutationFn: (employment: EmploymentHistory) => addEmployment(traineeId, employment),
  });
};

/**
 * Hook to delete employment from a trainee.
 * @param {string} traineeId the id of the trainee to delete the employment from.
 * @param {string} employmentId the id of the employment to delete.
 * */

export const useDeleteEmploymentHistory = (traineeId: string) => {
  return useMutation({
    mutationFn: (employmentId: string) => deleteEmployment(traineeId, employmentId),
  });
};

/**
 * Hook to edit employment of a trainee.
 * @param {string} traineeId the id of the trainee to edit the employment of.
 */
export const useEditEmploymentHistory = (traineeId: string) => {
  return useMutation({
    mutationFn: (employment: EmploymentHistory) => editEmployment(traineeId, employment),
  });
};
