import { PAGE_SIZE, PagedModel, mapPageToDomain } from '../../../data/pagination';

import { TraineeFilters } from '../models/trainee-summary';
import { TraineeSummaryResponse } from './types';
import axios from 'axios';
import { mapTraineeSummaryToDomain } from './mapper';

// Sorted by cohort, newest first, with the trainees without a cohort on top. A filter with several values goes as
// status=A&status=B.
export const getTraineeSummaries = async (page: number, filters: TraineeFilters) => {
  const { data } = await axios.get<PagedModel<TraineeSummaryResponse>>('/api/trainees', {
    params: { page, size: PAGE_SIZE, direction: 'DESC', ...filters, q: filters.q || undefined },
    paramsSerializer: { indexes: null },
  });
  return mapPageToDomain(data, mapTraineeSummaryToDomain);
};
