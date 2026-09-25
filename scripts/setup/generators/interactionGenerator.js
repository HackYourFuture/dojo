import { faker } from '../random.js';
import { interactions } from '../dummy-data/interactions.js';

export const generateInteraction = (trainee) => {
  const randomInteraction = faker.helpers.arrayElement(interactions);

  return {
    date: faker.date.future({ refDate: trainee.startDate }),
    type: randomInteraction.type,
    title: randomInteraction.title,
    details: randomInteraction.details,
  };
};
