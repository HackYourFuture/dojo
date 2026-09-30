import { NewOrganisation, OrganisationChanges } from '../Organisation';
import { createOrganisation, updateOrganisation } from '../api/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { organisationKeys } from './keys';

/** Hook to save the edited fields of an organisation profile. */
export const useUpdateOrganisation = (organisationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (changes: OrganisationChanges) => updateOrganisation(organisationId, changes),
    onSuccess: async () => await queryClient.invalidateQueries({ queryKey: organisationKeys.details(organisationId) }),
  });
};

/** Hook to create a new organisation. */
export const useCreateOrganisation = () => {
  return useMutation({
    mutationFn: (newOrganisation: NewOrganisation) => createOrganisation(newOrganisation),
  });
};
