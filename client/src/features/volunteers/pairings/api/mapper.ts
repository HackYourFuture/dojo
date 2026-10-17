import { MentorPairingRequest, MentorPairingResponse } from './types';

import { MentorPairing } from '../MentorPairing';
import { toISODateString } from '../../../../data/dates';

const toOptionalDate = (date: string | null) => (date ? new Date(date) : null);

const toOptionalDateString = (date: Date | null) => (date ? toISODateString(date) : null);

export const mapMentorPairingToDomain = (pairing: MentorPairingResponse): MentorPairing => {
  return {
    id: pairing.id,
    trainee: {
      id: pairing.trainee.id,
      name: pairing.trainee.name,
      profilePath: pairing.trainee.profilePath,
      thumbnailUrl: pairing.trainee.thumbnailUrl,
    },
    type: pairing.type,
    startDate: new Date(pairing.startDate),
    lastCheckinDate: toOptionalDate(pairing.lastCheckinDate),
    endDate: toOptionalDate(pairing.endDate),
    nextCheckinDate: toOptionalDate(pairing.nextCheckinDate),
    daysSinceLastCheckin: pairing.daysSinceLastCheckin,
  };
};

export const mapDomainToMentorPairingRequest = (pairing: MentorPairing): MentorPairingRequest => {
  return {
    traineeId: pairing.trainee.id,
    type: pairing.type,
    startDate: toISODateString(pairing.startDate),
    lastCheckinDate: toOptionalDateString(pairing.lastCheckinDate),
    endDate: toOptionalDateString(pairing.endDate),
    nextCheckinDate: toOptionalDateString(pairing.nextCheckinDate),
  };
};
