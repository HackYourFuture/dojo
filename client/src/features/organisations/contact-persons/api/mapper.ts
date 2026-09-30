import { ContactPersonRequest, ContactPersonResponse } from './types';

import { ContactPerson } from '../ContactPerson';
import { isBlank } from '../../api/mapper';

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
  return {
    name: contactPerson.name,
    email: isBlank(contactPerson.email) ? null : contactPerson.email,
    phone: isBlank(contactPerson.phone) ? null : contactPerson.phone,
    linkedinUrl: isBlank(contactPerson.linkedinUrl) ? null : contactPerson.linkedinUrl,
    jobTitle: isBlank(contactPerson.jobTitle) ? null : contactPerson.jobTitle,
    notes: isBlank(contactPerson.notes) ? null : contactPerson.notes,
  };
};
