import { Request, Response, NextFunction } from 'express';
import { SearchControllerType, SearchResult } from '../controllers/SearchController';
import { sendError } from './Handler';

interface SearchResponse {
  hits: {
    data: SearchResult[];
    size: number;
  };
}

export interface SearchHandlerType {
  search(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class SearchHandler implements SearchHandlerType {
  private readonly controller: SearchControllerType;

  constructor(controller: SearchControllerType) {
    this.controller = controller;
  }

  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    const maxAllowedLimit = 50;
    const inputLimit = Number(req.query.limit) || 20;
    const limit = Math.min(inputLimit, maxAllowedLimit);
    const query = (req.query.q as string) ?? '';

    try {
      const results = await this.controller.search({ query, limit });
      const response: SearchResponse = {
        hits: { data: results, size: results.length },
      };
      res.status(200).json(response);
    } catch (error) {
      sendError(error, res, next);
    }
  }
}
