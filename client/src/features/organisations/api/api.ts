import { NewOrganisation, OrganisationChanges } from '../Organisation';
import { OrganisationResponse, OrganisationSummaryResponse, PagedModel } from './types';
import {
  mapDomainToCreateOrganisationRequest,
  mapDomainToUpdateOrganisationRequest,
  mapOrganisationSummaryPageToDomain,
  mapOrganisationToDomain,
} from './mapper';

import axios from 'axios';

const PAGE_SIZE = 50;

// Sorted by name, from A to Z.
export const getOrganisationSummaries = async (page: number) => {
  const { data } = await axios.get<PagedModel<OrganisationSummaryResponse>>('/api/organisations', {
    params: { page, size: PAGE_SIZE },
  });
  return mapOrganisationSummaryPageToDomain(data);
};

export const getOrganisation = async (organisationId: string) => {
  const { data } = await axios.get<OrganisationResponse>(`/api/organisations/${organisationId}`);
  return mapOrganisationToDomain(data);
};

export const updateOrganisation = async (organisationId: string, changes: OrganisationChanges) => {
  const organisationRequest = mapDomainToUpdateOrganisationRequest(changes);
  const { data } = await axios.patch<OrganisationResponse>(`/api/organisations/${organisationId}`, organisationRequest);
  return mapOrganisationToDomain(data);
};

export const createOrganisation = async (newOrganisation: NewOrganisation) => {
  const organisationRequest = mapDomainToCreateOrganisationRequest(newOrganisation);
  const { data } = await axios.post<OrganisationResponse>('/api/organisations', organisationRequest);
  return mapOrganisationToDomain(data);
};
