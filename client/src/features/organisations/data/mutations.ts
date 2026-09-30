import { NewOrganisation, OrganisationChanges } from '../Organisation';
import { createOrganisation, updateOrganisation } from '../api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { organisationKeys } from './keys';

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
