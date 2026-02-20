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

export const mapStringToStrikeReason = (reason: string): StrikeReason => {
  // Check if the string is one of the valid values in the StrikeReason enum
  const isValid = Object.values(StrikeReason).includes(reason as StrikeReason);

  if (isValid) {
    return reason as StrikeReason;
  }
  throw new Error(`Invalid strike reason: ${reason}`);
};
