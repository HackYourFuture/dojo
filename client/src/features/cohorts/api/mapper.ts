import { PagedModel, TraineeSummaryResponse } from './types';
import { TraineeSummary, TraineeSummaryPage } from '../models/cohort';

export const mapTraineeSummaryToDomain = (trainee: TraineeSummaryResponse): TraineeSummary => {
  return {
    id: trainee.id,
    displayName: trainee.displayName,
    profilePath: trainee.profilePath,
    thumbnailUrl: trainee.thumbnailUrl,
    location: trainee.location,
    email: trainee.email,
    slackId: trainee.slackId,
    githubHandle: trainee.githubHandle,
    linkedinUrl: trainee.linkedinUrl,
    learningStatus: trainee.learningStatus,
    track: trainee.track,
    jobPath: trainee.jobPath,
    averageAssessmentScore: trainee.averageAssessmentScore,
    cohort: trainee.cohort,
  };
};

export const mapTraineeSummaryPageToDomain = (page: PagedModel<TraineeSummaryResponse>): TraineeSummaryPage => {
  return {
    trainees: page.content.map((trainee) => mapTraineeSummaryToDomain(trainee)),
    totalPages: page.page.totalPages,
  };
};
