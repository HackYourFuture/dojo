import { contactPersonKeys } from './keys';
import { getContactPersons } from '../api/api';
import { useQuery } from '@tanstack/react-query';

/** Hook to get the contact persons of an organisation, sorted by name. */
export const useGetContactPersons = (organisationId: string) => {
  return useQuery({
    queryKey: contactPersonKeys.list(organisationId),
    queryFn: () => getContactPersons(organisationId),
    refetchOnWindowFocus: false,
  });
};
