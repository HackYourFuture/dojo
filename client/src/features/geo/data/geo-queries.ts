import { getCities, getCountries } from '../api/api';
import { geoKeys } from './keys';
import { useQuery } from '@tanstack/react-query';

// The API finds nothing for a single letter.
export const MIN_GEO_QUERY_LENGTH = 2;

export const useSearchCities = (query: string) => {
  return useQuery({
    queryKey: geoKeys.cities(query),
    queryFn: () => getCities(query),
    enabled: query.length >= MIN_GEO_QUERY_LENGTH,
    // The places don't change while the app runs.
    staleTime: Infinity,
  });
};

export const useSearchCountries = (query: string) => {
  return useQuery({
    queryKey: geoKeys.countries(query),
    queryFn: () => getCountries(query),
    enabled: query.length >= MIN_GEO_QUERY_LENGTH,
    // The countries don't change while the app runs.
    staleTime: Infinity,
  });
};
