import { PAGE_SIZE, PagedModel, mapPageToDomain } from '../../../data/pagination';

import { TraineeSummaryResponse } from './types';
import axios from 'axios';
import { mapTraineeSummaryToDomain } from './mapper';

// Sorted by cohort, newest first, with the trainees without a cohort on top.
export const getTraineeSummaries = async (page: number) => {
  const { data } = await axios.get<PagedModel<TraineeSummaryResponse>>('/api/trainees', {
    params: { page, size: PAGE_SIZE, direction: 'DESC' },
  });
  return mapPageToDomain(data, mapTraineeSummaryToDomain);
};
