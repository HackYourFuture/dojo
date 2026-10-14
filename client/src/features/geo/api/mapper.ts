import { CityResponse, CountryResponse } from './types';

import { City } from '../models/city';
import { Country } from '../models/country';

export const mapCityToDomain = (city: CityResponse): City => {
  return {
    id: city.id,
    name: city.name,
    alternativeNames: city.alternativeNames,
    population: city.population,
    province: city.province,
    region: city.region,
    coordinates: city.coordinates,
    distanceAmsterdam: city.distanceAmsterdam,
  };
};

export const mapCountryToDomain = (country: CountryResponse): Country => {
  return {
    id: country.id,
    name: country.name,
    alternativeNames: country.alternativeNames,
    population: country.population,
    flag: country.flag,
  };
};
