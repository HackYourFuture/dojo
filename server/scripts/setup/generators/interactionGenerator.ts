import { faker } from '@faker-js/faker';
import { Trainee } from '../../../src/models/Trainee';
import { interactions } from '../dummy-data';
import { InteractionType, InteractionWithReporterID } from '../../../src/models/Interaction';

export const generateInteraction = (trainee: Trainee): InteractionWithReporterID => {
  const randomInteraction = faker.helpers.arrayElement(interactions);

  return {
    id: '',
    reporterID: '',
    date: faker.date.future({ refDate: trainee.educationInfo.startDate }),
    type: randomInteraction.type as InteractionType,
    title: randomInteraction.title,
    details: randomInteraction.details,
  };
};
