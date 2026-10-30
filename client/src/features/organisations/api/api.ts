import { NewOrganisation, OrganisationChanges, OrganisationFilters } from '../Organisation';
import { OrganisationResponse, OrganisationSummaryResponse } from './types';
import { PAGE_SIZE, PagedModel, mapPageToDomain } from '../../../data/pagination';
import {
  mapDomainToCreateOrganisationRequest,
  mapDomainToUpdateOrganisationRequest,
  mapOrganisationSummaryToDomain,
  mapOrganisationToDomain,
} from './mapper';

import axios from 'axios';
import { downloadFile } from '../../../data/http/downloadFile';

// Sorted by name, from A to Z. A filter with several values goes as partnership=A&partnership=B.
export const getOrganisationSummaries = async (page: number, filters: OrganisationFilters) => {
  const { data } = await axios.get<PagedModel<OrganisationSummaryResponse>>('/api/organisations', {
    params: { page, size: PAGE_SIZE, ...filters, q: filters.q || undefined },
    paramsSerializer: { indexes: null },
  });
  return mapPageToDomain(data, mapOrganisationSummaryToDomain);
};

// The organisations the list shows, all of them, as a CSV file named by the server.
export const exportOrganisations = (filters: OrganisationFilters) =>
  downloadFile('/api/organisations/export', { ...filters, q: filters.q || undefined }, 'organisations.csv');

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

export const deleteOrganisation = async (organisationId: string) => {
  await axios.delete(`/api/organisations/${organisationId}`);
};
