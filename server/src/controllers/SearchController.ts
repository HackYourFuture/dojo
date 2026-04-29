import { TraineesRepository } from '../repositories';
import { Trainee } from '../models';
import removeAccents from 'remove-accents';

export interface SearchResult {
  id: string;
  name: string;
  thumbnail: string | null;
  profilePath: string;
  cohort: number | null;
  searchScore: number;
}

export interface SearchParams {
  query: string;
  limit: number;
}

export interface SearchControllerType {
  search(params: SearchParams): Promise<SearchResult[]>;
}

export class SearchController implements SearchControllerType {
  private traineesRepository: TraineesRepository;
  constructor(traineesRepository: TraineesRepository) {
    this.traineesRepository = traineesRepository;
  }

  async search({ query, limit }: SearchParams): Promise<SearchResult[]> {
    if (query.length < 2) {
      return [];
    }

    const keywords = query
      .split(' ')
      .map((q) => q.toLocaleLowerCase().trim())
      .map(removeAccents)
      .filter((q) => q.length > 0);

    // Note: This is not efficient to fetch all trainees from the DB and then filter on the server side.
    // In an ideal scenario we should have a complex query to filter on the DB side.
    // However, because our dataset is not large, we can get away with this for now.
    const trainees = await this.traineesRepository.getAllTrainees();
    return trainees
      .map((trainee) => ({
        id: trainee.id,
        name: `${trainee.displayName}`,
        thumbnail: trainee.thumbnailURL ?? null,
        cohort: trainee.educationInfo.currentCohort ?? null,
        profilePath: trainee.profilePath,
        searchScore: this.calculateScore(trainee, keywords),
      }))
      .filter((trainee) => trainee.searchScore > 0)
      .sort(this.compareSearchResults)
      .slice(0, limit);
  }

  private calculateScore(trainee: Trainee, keywords: string[]): number {
    if (keywords.length === 1 && keywords[0] === trainee.contactInfo.email.toLocaleLowerCase()) {
      return 1000;
    }
    if (keywords.length === 1 && keywords[0] === trainee.contactInfo.githubHandle?.toLocaleLowerCase()) {
      return 1000;
    }

    const firstName = removeAccents(trainee.personalInfo.firstName.toLocaleLowerCase());
    const lastName = removeAccents(trainee.personalInfo.lastName.toLocaleLowerCase());
    const preferredName = removeAccents(trainee.personalInfo.preferredName?.toLocaleLowerCase() ?? '');

    const scores = keywords.map((keyword) => {
      const preferredNameMatchScore = this.getMatchScore(keyword, preferredName) * 3;
      const firstNameMatchScore = this.getMatchScore(keyword, firstName) * 2;
      const lastNameMatchScore = this.getMatchScore(keyword, lastName) * 1;
      return preferredNameMatchScore + firstNameMatchScore + lastNameMatchScore;
    });

    if (scores.some((score) => score === 0)) {
      return 0;
    }

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
    if (r1.searchScore !== r2.searchScore) {
      return r2.searchScore - r1.searchScore;
    }
    return (r2.cohort ?? 0) - (r1.cohort ?? 0);
  }
}
