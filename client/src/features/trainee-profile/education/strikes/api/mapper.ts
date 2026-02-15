import { Strike, StrikeReason } from '../models/strike';
import { StrikeRequest, StrikeResponse } from './types';

export const mapStrikeToDomain = (dto: StrikeResponse): Strike => {
  return {
    id: dto.id,
    comments: dto.comments,
    date: new Date(dto.date),
    reason: mapStringToStrikeReason(dto.reason),
    reporterName: dto.reporter.name,
    reporterImageUrl: dto.reporter.imageUrl,
  };
};

export const mapDomainToStrikeRequest = (strike: Strike): StrikeRequest => {
  console.log(strike);
  const request: StrikeRequest = {
    reason: strike.reason,
    date: strike.date.toISOString(),
    comments: strike.comments,
  };
  if (strike.id) {
    request.id = strike.id;
  }
  return request;
};
const mapStringToStrikeReason = (reason: string): StrikeReason => {
  switch (reason) {
    case 'late-submission':
      return StrikeReason.LateSubmission;
    case 'missed-submission':
      return StrikeReason.MissedSubmission;
    case 'incomplete-submission':
      return StrikeReason.IncompleteSubmission;
    case 'late-attendance':
      return StrikeReason.LateAttendance;
    case 'absence':
      return StrikeReason.Absence;
    case 'pending-feedback':
      return StrikeReason.PendingFeedback;
    case 'other':
      return StrikeReason.Other;
    default:
      throw new Error(`Unknown strike reason: ${reason}`);
  }
};
