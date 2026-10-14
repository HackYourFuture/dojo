export interface CityResponse {
  id: string;
  name: string;
  alternativeNames: string[];
  population: number;
  province: string;
  region: string;
  coordinates: { lat: number; lon: number };
  distanceAmsterdam: number | null;
}

export interface CountryResponse {
  id: string;
  name: string;
  alternativeNames: string[];
  population: number;
  flag: string;
  code: string;
}
