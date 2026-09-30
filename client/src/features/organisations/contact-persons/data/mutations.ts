import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';
import { addContactPerson, deleteContactPerson, editContactPerson } from '../api/api';

import { ContactPerson } from '../ContactPerson';
import { contactPersonKeys } from './keys';

// Also run after a failure, which may still have changed the list, like a colleague deleting the contact person first.
// Returned, so a mutation only finishes once the list has reloaded.
const invalidateContactPersonsQuery = (queryClient: QueryClient, organisationId: string) => {
  return queryClient.invalidateQueries({ queryKey: contactPersonKeys.list(organisationId) });
};

/** Hook to add a contact person to an organisation. */
export const useAddContactPerson = (organisationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactPerson: ContactPerson) => addContactPerson(organisationId, contactPerson),
    onSettled: () => invalidateContactPersonsQuery(queryClient, organisationId),
    // A failed request may still have added the contact person, so a retry could add it twice.
    retry: false,
  });
};

/** Hook to edit a contact person of an organisation. */
export const useEditContactPerson = (organisationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactPerson: ContactPerson) => editContactPerson(organisationId, contactPerson),
    onSettled: () => invalidateContactPersonsQuery(queryClient, organisationId),
  });
};

/** Hook to delete a contact person from an organisation. */
export const useDeleteContactPerson = (organisationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (contactPersonId: string) => deleteContactPerson(organisationId, contactPersonId),
    onSettled: () => invalidateContactPersonsQuery(queryClient, organisationId),
  });
};
