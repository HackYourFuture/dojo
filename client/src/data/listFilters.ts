import { SelectOption } from './types/SelectOption';

// The list filters take an enum by its Java name: on-hold is ON_HOLD.
export const toApiEnumName = (value: string) => value.toUpperCase().split('-').join('_');

// The labels of the picked options, as a closed dropdown shows them.
export const pickedLabels = (options: SelectOption[], values: string[]) =>
  options
    .filter((option) => values.includes(option.value))
    .map((option) => option.label)
    .join(', ') || 'Any';

// A multiple select's value, which is a comma-separated string when the browser autofills it.
export const toValues = (value: string | string[]) => (typeof value === 'string' ? value.split(',') : value);

// A whole number from the URL, or null when it is missing or not a whole number.
export const numberParam = (params: URLSearchParams, key: string) => {
  const value = params.get(key);
  return value === null || value === '' || !Number.isInteger(Number(value)) ? null : Number(value);
};

// Sets a filter in the URL's query; an empty value removes it.
export const setParam = (params: URLSearchParams, key: string, values: string[]) => {
  params.delete(key);
  values.filter((value) => value !== '').forEach((value) => params.append(key, value));
  return params;
};
