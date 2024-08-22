import { Country } from './Country';

export interface IPGeolocation {
  ip: string;
  country: Country;
}

export interface DBIPGeolocation {
  ip: string;
  countryCode: string;
}
