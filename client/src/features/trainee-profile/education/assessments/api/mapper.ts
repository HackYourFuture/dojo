import { AssessmentRequest, AssessmentResponse } from './types';

import { Assessment } from '../models/assessment';
import { toISODateString } from '../../../utils/dateHelper';

export const mapAssessmentToDomain = (assessment: AssessmentResponse): Assessment => {
  return {
    id: assessment.id,
    date: new Date(assessment.date),
    type: assessment.type,
    score: assessment.score,
    result: assessment.result,
    comments: assessment.comments,
  };
};

export const mapDomainToAssessmentRequest = (assessment: Assessment): AssessmentRequest => {
  return {
    date: toISODateString(assessment.date),
    type: assessment.type,
    result: assessment.result,
    score: assessment.score ?? null,
    comments: assessment.comments || null,
  };
};
