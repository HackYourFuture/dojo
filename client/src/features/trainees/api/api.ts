import { PAGE_SIZE, PagedModel, mapPageToDomain } from '../../../data/pagination';

import { TraineeFilters } from '../models/trainee-summary';
import { TraineeSummaryResponse } from './types';
import axios from 'axios';
import { mapTraineeSummaryToDomain } from './mapper';

export const getTraineeSummaries = async (page: number, filters: TraineeFilters, size = PAGE_SIZE) => {
  const { data } = await axios.get<PagedModel<TraineeSummaryResponse>>('/api/trainees', {
    params: { page, size, direction: 'DESC', ...filters, q: filters.q || undefined },
    paramsSerializer: { indexes: null },
  });
  return mapPageToDomain(data, mapTraineeSummaryToDomain);
};

// The trainees the search finds for the text, newest cohort first. Only the first page, for a picker.
export const searchTrainees = async (query: string) => {
  const { data } = await axios.get<PagedModel<TraineeSummaryResponse>>('/api/trainees', {
    params: { q: query, size: 100, direction: 'DESC' },
  });
  return data.content.map(mapTraineeSummaryToDomain);
};
