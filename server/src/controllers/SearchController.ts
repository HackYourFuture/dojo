import { NextFunction, Request, Response } from 'express';
import { TraineesRepository } from '../repositories';
import { Trainee } from '../models';

interface SearchResponse {
  hits: SearchHits;
}

interface SearchHits {
  data: SearchResult[];
  size: number;
}

interface SearchResult {
  id: string;
  name: string;
  thumbnail: string | null;
  cohort: number | null;
}

export interface SearchControllerType {
  search(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export class SearchController implements SearchControllerType {
  private traineesRepository: TraineesRepository;
  constructor(traineesRepository: TraineesRepository) {
    this.traineesRepository = traineesRepository;
  }

  async search(req: Request, res: Response, next: NextFunction) {
    const maxAllowedLimit = 50;
    const inputLimit = Number(req.query.limit) || 20;
    const limit = Math.min(inputLimit, maxAllowedLimit);
    const searchQuery: string = (req.query.q as string) ?? '';
    let trainees: Trainee[];
    try {
      trainees = await this.traineesRepository.searchTrainees(searchQuery, limit);
    } catch (error) {
      next(error);
      return;
    }

    const results = trainees.map((trainee) => {
      return {
        id: trainee.id,
        name: `${trainee.displayName}`,
        thumbnail: trainee.personalInfo.imageUrl ? `${trainee.personalInfo.imageUrl}?size=small` : null,
        cohort: trainee.educationInfo.currentCohort ?? null,
      };
    });

    const response: SearchResponse = {
      hits: {
        data: results,
        size: results.length,
      },
    };
    res.status(200).json(response);
  }
}
