import { mapContactPersonToDomain, mapDomainToContactPersonRequest } from './mapper';

import { ContactPerson } from '../ContactPerson';
import { ContactPersonResponse } from './types';
import axios from 'axios';

// Sorted by name, from A to Z.
export const getContactPersons = async (organisationId: string) => {
  const { data } = await axios.get<ContactPersonResponse[]>(`/api/organisations/${organisationId}/contact-persons`);
  return data.map((contactPerson) => mapContactPersonToDomain(contactPerson));
};

export const addContactPerson = async (organisationId: string, contactPerson: ContactPerson) => {
  const contactPersonRequest = mapDomainToContactPersonRequest(contactPerson);
  const { data } = await axios.post<ContactPersonResponse>(
    `/api/organisations/${organisationId}/contact-persons`,
    contactPersonRequest
  );
  return mapContactPersonToDomain(data);
};

export const editContactPerson = async (organisationId: string, contactPerson: ContactPerson) => {
  const contactPersonRequest = mapDomainToContactPersonRequest(contactPerson);
  const { data } = await axios.put<ContactPersonResponse>(
    `/api/organisations/${organisationId}/contact-persons/${contactPerson.id}`,
    contactPersonRequest
  );
  return mapContactPersonToDomain(data);
};

export const deleteContactPerson = async (organisationId: string, contactPersonId: string) => {
  await axios.delete(`/api/organisations/${organisationId}/contact-persons/${contactPersonId}`);
};
