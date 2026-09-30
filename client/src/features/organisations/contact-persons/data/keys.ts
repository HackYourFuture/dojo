const CONTACT_PERSONS_QUERY_KEY = 'contactPersons';

export const contactPersonKeys = {
  list: (organisationId: string) => [CONTACT_PERSONS_QUERY_KEY, 'list', organisationId] as const,
};
