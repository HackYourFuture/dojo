import { DashboardData, LabelCount } from '../models/dashboard';
import { DashboardResponse } from './types';
import { SelectOption, educationLevelOptions, genderOptions } from '../../trainee-profile/utils/selectOptions';
import { getTrackLabel } from '../../../data/labels/traineeLabels';

const MAX_COUNTRY_ROWS = 10;
const NOT_SPECIFIED = 'Not specified';

// The label of the profile's dropdown, or the raw value when the dropdown does not have it yet.
const optionLabel = (options: SelectOption[], value: string | null) =>
  options.find((option) => option.value === value)?.label ?? value ?? NOT_SPECIFIED;

// Keeps the largest countries and sums the rest into one "Other" row, so the chart stays at most 10 rows.
const withOther = (rows: LabelCount[]): LabelCount[] => {
  if (rows.length <= MAX_COUNTRY_ROWS) {
    return rows;
  }
  const other = rows.slice(MAX_COUNTRY_ROWS - 1).reduce((sum, row) => sum + row.count, 0);
  return [...rows.slice(0, MAX_COUNTRY_ROWS - 1), { label: 'Other', count: other }];
};

export const mapDashboardToDomain = (dashboard: DashboardResponse): DashboardData => {
  return {
    overview: dashboard.overview,
    learningStatuses: dashboard.learningStatuses,
    tracks: dashboard.tracks.map(({ track, count }) => ({ label: getTrackLabel(track), count })),
    educationLevels: dashboard.educationLevels.map(({ educationLevel, count }) => ({
      label: optionLabel(educationLevelOptions, educationLevel),
      count,
    })),
    countries: withOther(dashboard.countries.map(({ country, count }) => ({ label: country ?? NOT_SPECIFIED, count }))),
    genders: dashboard.genders.map(({ gender, count }) => ({ label: optionLabel(genderOptions, gender), count })),
  };
};
