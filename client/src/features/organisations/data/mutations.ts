import { NewOrganisation, OrganisationChanges } from '../Organisation';
import { createOrganisation, deleteOrganisation, updateOrganisation } from '../api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { organisationKeys } from './keys';
import { searchKeys } from '../../search/data/keys';

/** Hook to save the edited fields of an organisation profile. */
export const useUpdateOrganisation = (organisationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (changes: OrganisationChanges) => updateOrganisation(organisationId, changes),
    // The response is the saved organisation, so the profile shows it without loading it again.
    onSuccess: (organisation) => queryClient.setQueryData(organisationKeys.details(organisationId), organisation),
  });
};

/** Hook to create a new organisation. */
export const useCreateOrganisation = () => {
  return useMutation({
    mutationFn: (newOrganisation: NewOrganisation) => createOrganisation(newOrganisation),
    // A failed request may still have created it, and nothing stops a second organisation with the same name.
    retry: false,
  });
};

/** Hook to delete an organisation with its contact persons, interactions and logo. */
export const useDeleteOrganisation = (organisationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteOrganisation(organisationId),
    // A retry after a lost response would fail on the organisation that is already deleted.
    retry: false,
    // Nothing is returned, so the page does not wait for a list to reload before it leaves the profile.
    onSuccess: () => {
      // Removed instead of reset, so the profile that is still on screen does not load the deleted organisation again.
      queryClient.removeQueries({ queryKey: organisationKeys.details(organisationId) });
      // Reset, so a list or search on screen reloads, like after going back while the delete ran.
      queryClient.resetQueries({ queryKey: organisationKeys.list() });
      queryClient.resetQueries({ queryKey: searchKeys.all() });
    },
  });
};
