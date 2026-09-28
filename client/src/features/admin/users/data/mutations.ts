import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addUser, deleteUser, editUser } from '../api/api';

import { userKeys } from './keys';

const invalidateUsersQuery = (queryClient: QueryClient) => {
  return queryClient.invalidateQueries({ queryKey: userKeys.list() });
};

/** Hook to add a user. */
export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addUser,
    onSuccess: async () => await invalidateUsersQuery(queryClient),
  });
};

/** Hook to edit an existing user. */
export const useEditUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: editUser,
    onSuccess: async () => await invalidateUsersQuery(queryClient),
  });
};

/** Hook to delete a user. */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => await invalidateUsersQuery(queryClient),
  });
};
