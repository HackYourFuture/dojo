import { ContactPersonRequest, ContactPersonResponse } from './types';

import { ContactPerson } from '../ContactPerson';
import { blankFieldsToNull } from '../../../../data/text';

export const mapContactPersonToDomain = (contactPerson: ContactPersonResponse): ContactPerson => {
  return {
    id: contactPerson.id,
    name: contactPerson.name,
    email: contactPerson.email,
    phone: contactPerson.phone,
    linkedinUrl: contactPerson.linkedinUrl,
    jobTitle: contactPerson.jobTitle,
    notes: contactPerson.notes,
  };
};

export const mapDomainToContactPersonRequest = (contactPerson: ContactPerson): ContactPersonRequest => {
  return blankFieldsToNull<ContactPersonRequest>({
    name: contactPerson.name,
    email: contactPerson.email,
    phone: contactPerson.phone,
    linkedinUrl: contactPerson.linkedinUrl,
    jobTitle: contactPerson.jobTitle,
    notes: contactPerson.notes,
  });
};
