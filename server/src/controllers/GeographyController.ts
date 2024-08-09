import { Request, Response, NextFunction } from 'express';
import { GeographyRepository } from '../repositories';

export interface GeographyControllerType {
  getCountries(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCities(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class GeographyController implements GeographyControllerType {
  private readonly geographyRepository: GeographyRepository;
  constructor(geographyRepository: GeographyRepository) {
    this.geographyRepository = geographyRepository;
  }

  async getCountries(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query = (req.query.q as string) ?? '';
    const limit = Number.parseInt(req.query.limit as string) || null;
    try {
      const countries = await this.geographyRepository.searchCountry(query, limit);
      const jsonResponse = countries.map(({ name, flag }) => {
        return { name, flag };
      });
      res.json(jsonResponse);
    } catch (error) {
      next(error);
    }
  }

  async getCities(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query = (req.query.q as string) ?? '';
    const limit = Number.parseInt(req.query.limit as string) || null;
    try {
      const cities = await this.geographyRepository.searchCity(query, limit);
      const jsonResponse = cities.map((city) => city.name);
      res.json(jsonResponse);
    } catch (error) {
      next(error);
    }
  }
}
