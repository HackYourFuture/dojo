import { faker } from '@faker-js/faker';
import { StrikeReason, StrikeWithReporterID } from '../../../src/models/Strike';
import { Trainee } from '../../../src/models/Trainee';
import { strikeComments } from '../dummy-data';

export const generateStrike = (trainee: Trainee): StrikeWithReporterID => {
  return {
    id: '',
    reporterID: '',
    date: faker.date.future({ refDate: trainee.educationInfo.startDate }),
    reason: faker.helpers.arrayElement(Object.values(StrikeReason)),
    comments: faker.helpers.arrayElement(strikeComments),
  };
};
