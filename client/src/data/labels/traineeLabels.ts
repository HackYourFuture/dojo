import { LearningStatus, Track } from '../types/Trainee';
import { formatTextToFriendly } from '../../features/trainee-profile/utils/formHelper';

export const getTrackLabel = (track: Track): string => {
  switch (track) {
    case Track.Backend:
      return 'Backend';
    case Track.Frontend:
      return 'Frontend';
    case Track.Data:
      return 'Data';
    case Track.Tester:
      return 'Tester';
    case Track.Cloud:
      return 'Cloud';
    case Track.Core:
      return 'Core Program';
    case Track.FullstackLegacy:
      return 'Fullstack (Legacy)';
    default:
      return track;
  }
};

export const learningStatusToLabel = (status?: LearningStatus | string): string => {
  switch (status) {
    case LearningStatus.Studying:
      return 'Studying';
    case LearningStatus.Graduated:
      return 'Graduated';
    case LearningStatus.OnHold:
      return 'On hold';
    case LearningStatus.Quit:
      return 'Quit';
    default:
      return formatTextToFriendly(status ? String(status) : '');
  }
};
