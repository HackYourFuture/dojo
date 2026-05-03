import { Request, Response, NextFunction } from 'express';
import { GeographyControllerType } from '../controllers/GeographyController';
import { sendError } from './Handler';

export interface GeographyHandlerType {
  getCountries(req: Request, res: Response, next: NextFunction): Promise<void>;
  getCities(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class GeographyHandler implements GeographyHandlerType {
  private readonly controller: GeographyControllerType;

  constructor(controller: GeographyControllerType) {
    this.controller = controller;
  }

  async getCountries(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query = (req.query.q as string) ?? '';
    const limit = Number.parseInt(req.query.limit as string) || null;
    try {
      const countries = await this.controller.getCountries({ query, limit });
      res.status(200).json(countries);
    } catch (error) {
      sendError(error, res, next);
    }
  }

  async getCities(req: Request, res: Response, next: NextFunction): Promise<void> {
    const query = (req.query.q as string) ?? '';
    const limit = Number.parseInt(req.query.limit as string) || null;
    try {
      const cities = await this.controller.getCities({ query, limit });
      res.status(200).json(cities);
    } catch (error) {
      sendError(error, res, next);
    }
  }
}
