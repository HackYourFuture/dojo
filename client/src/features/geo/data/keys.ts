const GEO_QUERY_KEY = 'geo';

export const geoKeys = {
  cities: (query: string) => [GEO_QUERY_KEY, 'cities', query.toLowerCase()] as const,
  countries: (query: string) => [GEO_QUERY_KEY, 'countries', query.toLowerCase()] as const,
};
