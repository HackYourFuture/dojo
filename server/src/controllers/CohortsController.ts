import { Request, Response } from 'express';
import { TraineesRepository } from '../repositories';
import { LearningStatus, Trainee } from '../models';

interface Cohort {
  cohort: number | null;
  trainees: TraineeSummary[];
}

interface TraineeSummary {
  id: string;
  displayName: string;
  thumbnailURL: string | null;
  location?: string;
  hasWorkPermit?: boolean;
  email: string;
  slackID?: string;
  githubHandle?: string;
  linkedIn?: string;
  LearningStatus: string;
  JobPath: string;
  strikes: number;
}

export interface CohortsControllerType {
  getCohorts(req: Request, res: Response): Promise<void>;
}

export class CohortsController implements CohortsControllerType {
  private traineesRepository: TraineesRepository;
  constructor(traineesRepository: TraineesRepository) {
    this.traineesRepository = traineesRepository;
  }

  async getCohorts(req: Request, res: Response) {
    const MAX_POSSIBLE_COHORT = 999;
    let start = Number.parseInt(req.query.start as string) || 0;
    let end = Number.parseInt(req.query.end as string) || MAX_POSSIBLE_COHORT;
    start = Math.max(start, 0);
    end = Math.min(end, 999);

    const trainees = await this.traineesRepository.getTraineesByCohort(start, end, true);

    // Group trainees by cohort
    const cohortDictionary = Object.groupBy(trainees, (trainee) => `${trainee.educationInfo.currentCohort}`);

    // Sort trainees in each group
    Object.values(cohortDictionary).forEach((trainees) => {
      trainees?.sort(this.compareTraineeInCohort);
    });
    // Convert dictionary to array of cohorts
    const result: Cohort[] = Object.entries(cohortDictionary).map(([cohortNumber, trainees]) => {
      const cohortNumberInt = Number.parseInt(cohortNumber);
      return {
        cohort: isNaN(cohortNumberInt) ? null : cohortNumberInt,
        trainees: (trainees ?? []).map(this.getTraineeSummary),
      };
    });
    res.status(200).json(result);
  }

  private getTraineeSummary(trainee: Trainee): TraineeSummary {
    const thumbnailURL = trainee.personalInfo.imageUrl ? `${trainee.personalInfo.imageUrl}?size=small` : null;
    return {
      id: trainee.id,
      displayName: trainee.displayName,
      thumbnailURL: thumbnailURL,
      location: trainee.personalInfo.location,
      hasWorkPermit: trainee.personalInfo.hasWorkPermit,
      email: trainee.contactInfo.email,
      slackID: trainee.contactInfo.slackId,
      githubHandle: trainee.contactInfo.githubHandle,
      linkedIn: trainee.contactInfo.linkedin,
      LearningStatus: trainee.educationInfo.learningStatus,
      JobPath: trainee.employmentInfo.jobPath,
      strikes: trainee.educationInfo.strikes.length,
    };
  }

  private compareTraineeInCohort(a: Trainee, b: Trainee) {
    const statusIndexA = Object.values(LearningStatus).indexOf(a.educationInfo.learningStatus);
    const statusIndexB = Object.values(LearningStatus).indexOf(b.educationInfo.learningStatus);

    // Primary sort by status, secondary sort by display name
    return statusIndexA - statusIndexB || a.displayName.localeCompare(b.displayName);
  }
}
