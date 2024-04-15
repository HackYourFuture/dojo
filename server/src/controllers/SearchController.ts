import { Request, Response } from "express";
import { TraineesRepository } from "../repositories/TraineesRepository";

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
}

export interface SearchControllerType {
  search(req: Request, res: Response): Promise<void>;
}

export class SearchController implements SearchControllerType {
  private traineesRepository: TraineesRepository;
  constructor(traineesRepository: TraineesRepository) {
    this.traineesRepository = traineesRepository;
  }

  async search(req: Request, res: Response) {
    const maxAllowedLimit = 50;
    const inputLimit = Number(req.query.limit) || 20;
    const limit = Math.min(inputLimit, maxAllowedLimit);

    const searchQuery: string = (req.query.q as string) ?? "";
    const trainees = await this.traineesRepository.searchTrainees(searchQuery, limit);
    const results = trainees.map(trainee => ({
      id: trainee._id,
      name: `${trainee.personalInfo.firstName} ${trainee.personalInfo.lastName}`,
    }));

    const response: SearchResponse = {
      hits: {
        data: results,
        size: results.length,
      },
    };
    res.status(200).json(response);
  }
}
