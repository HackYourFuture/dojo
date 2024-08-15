import { NextFunction, Request, Response } from 'express';
import { TraineesRepository } from '../repositories';
import { Trainee } from '../models';
import removeAccents from 'remove-accents';

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
  searchScore: number;
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

    let results: SearchResult[] = [];
    try {
      results = await this.getSearchResults(searchQuery, limit);
    } catch (error) {
      next(error);
      return;
    }

    const response: SearchResponse = {
      hits: {
        data: results,
        size: results.length,
      },
    };
    res.status(200).json(response);
  }

  private async getSearchResults(searchQuery: string, limit: number): Promise<SearchResult[]> {
    // If the search query is too short, return an empty array
    if (searchQuery.length < 2) {
      return [];
    }

    const keywords = searchQuery
      .split(' ')
      .map((query) => query.toLocaleLowerCase().trim())
      .map(removeAccents)
      .filter((query) => query.length > 0);

    // Note: This is not efficient to fetch all trainees from the DB and then filter on the server side.
    // In an ideal scenario we should have a complex query to filter on the DB side.
    // However, because our dataset is not large, we can get away with this for now.
    const trainees = await this.traineesRepository.getAllTrainees();

    // Process all trainees, calculate the search score and return the top N results
    return trainees
      .map((trainee) => {
        return {
          id: trainee.id,
          name: `${trainee.displayName}`,
          thumbnail: trainee.personalInfo.imageUrl ? `${trainee.personalInfo.imageUrl}?size=small` : null,
          cohort: trainee.educationInfo.currentCohort ?? null,
          searchScore: this.calculateScore(trainee, keywords),
        };
      })
      .filter((trainee) => trainee.searchScore > 0)
      .sort(this.compareSearchResults)
      .slice(0, limit);
  }

  private calculateScore(trainee: Trainee, keywords: string[]): number {
    // Exact match email
    if (keywords.length === 1 && keywords[0] === trainee.contactInfo.email.toLocaleLowerCase()) {
      return 1000;
    }
    // Exact match github handle
    if (keywords.length === 1 && keywords[0] === trainee.contactInfo.githubHandle?.toLocaleLowerCase()) {
      return 1000;
    }

    const firstName = removeAccents(trainee.personalInfo.firstName.toLocaleLowerCase());
    const lastName = removeAccents(trainee.personalInfo.lastName.toLocaleLowerCase());
    const preferredName = removeAccents(trainee.personalInfo.preferredName?.toLocaleLowerCase() ?? '');

    // calculate score per keyword
    const scores = keywords.map((keyword) => {
      const preferredNameMatchScore = this.getMatchScore(keyword, preferredName) * 3;
      const firstNameMatchScore = this.getMatchScore(keyword, firstName) * 2;
      const lastNameMatchScore = this.getMatchScore(keyword, lastName) * 1;
      return preferredNameMatchScore + firstNameMatchScore + lastNameMatchScore;
    });

    // All keywords must have a score. If one of the keywords does not match, return 0
    if (scores.some((score) => score === 0)) {
      return 0;
    }

    // Otherwise, return the sum of all scores per keyword
    return scores.reduce((acc, score) => acc + score);
  }

  private getMatchScore(keyword: string, string: string): number {
    if (string === keyword) {
      return 100;
    }
    if (string.startsWith(keyword)) {
      return 10;
    }
    if (string.includes(keyword)) {
      return 1;
    }
    return 0;
  }

  private compareSearchResults(r1: SearchResult, r2: SearchResult): number {
    // Primary sort by search score descending, secondary sort by cohort descending
    if (r1.searchScore !== r2.searchScore) {
      return r2.searchScore - r1.searchScore;
    }
    return (r2.cohort ?? 0) - (r1.cohort ?? 0);
  }
}
