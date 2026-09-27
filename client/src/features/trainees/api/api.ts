import { PagedModel, TraineeSummaryResponse } from './types';

import axios from 'axios';
import { mapTraineeSummaryPageToDomain } from './mapper';

const PAGE_SIZE = 50;

// Sorted by cohort, newest first, with the trainees without a cohort on top.
export const getTraineeSummaries = async (page: number) => {
  const { data } = await axios.get<PagedModel<TraineeSummaryResponse>>('/api/trainees', {
    params: { page, size: PAGE_SIZE, direction: 'DESC' },
  });
  return mapTraineeSummaryPageToDomain(data);
};
