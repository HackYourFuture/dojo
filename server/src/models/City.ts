export interface City {
  readonly _id: string;
  name: string;
  alternateNames: string[];
  coordinates?: { lon: number, lat: number };
  population: number;
  country_code: string;
}
