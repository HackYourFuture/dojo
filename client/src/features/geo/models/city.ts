// A Dutch city, town or village.
export interface City {
  readonly id: string;
  name: string;
  alternativeNames: string[];
  // 0 when unknown.
  population: number;
  province: string;
  // The labour market region (arbeidsmarktregio).
  region: string;
  coordinates: { lat: number; lon: number };
  // The driving distance in km, null when there is no route.
  distanceAmsterdam: number | null;
}
