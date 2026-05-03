import { TraineesRepository } from '../repositories';
import { LearningStatus, Track, calculateAverageTestScore, Trainee } from '../models';

export interface Cohort {
  cohort: number | null;
  trainees: TraineeSummary[];
}

interface TraineeSummary {
  id: string;
  displayName: string;
  profilePath: string;
  thumbnailURL: string | null;
  location?: string;
  hasWorkPermit?: boolean;
  email: string;
  slackID?: string;
  githubHandle?: string;
  linkedIn?: string;
  LearningStatus: string;
  track: Track;
  JobPath: string;
  averageTestScore: number | null;
}

export interface GetCohortsParams {
  start: number;
  end: number;
}

export interface CohortsControllerType {
  getCohorts(params: GetCohortsParams): Promise<Cohort[]>;
}

export class CohortsController implements CohortsControllerType {
  private traineesRepository: TraineesRepository;
  constructor(traineesRepository: TraineesRepository) {
    this.traineesRepository = traineesRepository;
  }

  async getCohorts({ start, end }: GetCohortsParams): Promise<Cohort[]> {
    const trainees = await this.traineesRepository.getTraineesByCohort(start, end, true);

    // Group trainees by cohort
    const cohortDictionary = Object.groupBy(trainees, (trainee) => `${trainee.educationInfo.currentCohort}`);

    // Sort trainees in each group
    Object.values(cohortDictionary).forEach((trainees) => {
      trainees?.sort(this.compareTraineeInCohort.bind(this));
    });
    // Convert dictionary to array of cohorts
    const result: Cohort[] = Object.entries(cohortDictionary).map(([cohortNumber, trainees]) => {
      const cohortNumberInt = Number.parseInt(cohortNumber);
      return {
        cohort: isNaN(cohortNumberInt) ? null : cohortNumberInt,
        trainees: (trainees ?? []).map(this.getTraineeSummary.bind(this)),
      };
    });
    return result;
  }

  private getTraineeSummary(trainee: Trainee): TraineeSummary {
    return {
      id: trainee.id,
      displayName: trainee.displayName,
      profilePath: trainee.profilePath,
      thumbnailURL: trainee.thumbnailURL ?? null,
      location: trainee.personalInfo.location,
      hasWorkPermit: trainee.personalInfo.hasWorkPermit,
      email: trainee.contactInfo.email,
      slackID: trainee.contactInfo.slackId,
      githubHandle: trainee.contactInfo.githubHandle,
      linkedIn: trainee.contactInfo.linkedin,
      LearningStatus: trainee.educationInfo.learningStatus,
      track: trainee.educationInfo.track,
      JobPath: trainee.employmentInfo.jobPath,
      averageTestScore: calculateAverageTestScore(trainee.educationInfo.tests),
    };
  }

  private compareTraineeInCohort(a: Trainee, b: Trainee) {
    const statusIndexA = Object.values(LearningStatus).indexOf(a.educationInfo.learningStatus);
    const statusIndexB = Object.values(LearningStatus).indexOf(b.educationInfo.learningStatus);

    // Primary sort by status, secondary sort by display name
    return statusIndexA - statusIndexB || a.displayName.localeCompare(b.displayName);
  }
}
