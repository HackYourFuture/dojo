import { mapAssessmentToDomain, mapAssessmentsToDomain, mapDomainToAssessmentRequest } from './mapper';

import { Assessment } from '../models/assessment';
import { AssessmentResponse, AssessmentsResponse } from './types';
import axios from 'axios';

export const getAssessments = async (traineeId: string) => {
  const { data } = await axios.get<AssessmentsResponse>(`/api/trainees/${traineeId}/assessments`);
  return mapAssessmentsToDomain(data);
};

export const addAssessment = async (traineeId: string, assessment: Assessment) => {
  const assessmentRequest = mapDomainToAssessmentRequest(assessment);
  const { data } = await axios.post<AssessmentResponse>(`/api/trainees/${traineeId}/assessments`, assessmentRequest);
  return mapAssessmentToDomain(data);
};

export const editAssessment = async (traineeId: string, assessment: Assessment) => {
  const assessmentRequest = mapDomainToAssessmentRequest(assessment);
  const { data } = await axios.put<AssessmentResponse>(
    `/api/trainees/${traineeId}/assessments/${assessment.id}`,
    assessmentRequest
  );
  return mapAssessmentToDomain(data);
};

export const deleteAssessment = async (traineeId: string, assessmentId: string) => {
  await axios.delete(`/api/trainees/${traineeId}/assessments/${assessmentId}`);
};
