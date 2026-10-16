import { TraineeSummary } from '../models/trainee-summary';
import { TraineeSummaryResponse } from './types';
import { mapCityToDomain } from '../../geo/api/mapper';

export const mapTraineeSummaryToDomain = (trainee: TraineeSummaryResponse): TraineeSummary => {
  return {
    id: trainee.id,
    displayName: trainee.displayName,
    profilePath: trainee.profilePath,
    thumbnailUrl: trainee.thumbnailUrl,
    city: trainee.city ? mapCityToDomain(trainee.city) : null,
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
