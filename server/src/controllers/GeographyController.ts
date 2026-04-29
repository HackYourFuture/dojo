import { GeographyRepository } from '../repositories';

export interface CountryResult {
  name: string;
  flag: string;
}

export interface SearchGeographyParams {
  query: string;
  limit: number | null;
}

export interface GeographyControllerType {
  getCountries(params: SearchGeographyParams): Promise<CountryResult[]>;
  getCities(params: SearchGeographyParams): Promise<string[]>;
}

export class GeographyController implements GeographyControllerType {
  private readonly geographyRepository: GeographyRepository;
  constructor(geographyRepository: GeographyRepository) {
    this.geographyRepository = geographyRepository;
  }

  async getCountries({ query, limit }: SearchGeographyParams): Promise<CountryResult[]> {
    const countries = await this.geographyRepository.searchCountry(query, limit);
    return countries.map(({ name, flag }) => ({ name, flag }));
  }

  async getCities({ query, limit }: SearchGeographyParams): Promise<string[]> {
    const cities = await this.geographyRepository.searchCity(query, limit);
    return cities.map((city) => city.name);
  }
}
