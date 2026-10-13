import { CityResponse, CountryResponse } from './types';
import { mapCityToDomain, mapCountryToDomain } from './mapper';
import axios from 'axios';

export const getCities = async (query: string) => {
  const { data } = await axios.get<CityResponse[]>('/api/geo/cities', { params: { q: query } });
  return data.map((city) => mapCityToDomain(city));
};

export const getCountries = async (query: string) => {
  const { data } = await axios.get<CountryResponse[]>('/api/geo/countries', { params: { q: query } });
  return data.map((country) => mapCountryToDomain(country));
};
