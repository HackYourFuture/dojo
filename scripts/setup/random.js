// import { Gender, LearningStatus } from '../../src/models/Trainee';
import { Faker, en, ar, tr, ru, uk } from '@faker-js/faker';
const fakerInstance = new Faker({ seed: 422841832, locale: [en, ar, tr, ru, uk] });
export const faker = fakerInstance;

export const getRandomGender = () => {
  return faker.helpers.weightedArrayElement([
    { value: 'man', weight: 50 },
    { value: 'woman', weight: 50 },
    { value: 'non-binary', weight: 1 },
  ]);
};

export const getNameGender = (gender) => {
  if (gender === 'man') {
    return 'male';
  }
  if (gender === 'woman') {
    return 'female';
  }
  return 'generic';
};

export const getPronouns = (gender) => {
  if (gender === 'man') {
    return 'He/him';
  }
  if (gender === 'woman') {
    return 'She/her';
  }
  return 'They/them';
};

export const getRandomPhoneNumber = () => {
  const prefix = '+316';
  const number = faker.number.int({ min: 0, max: 99999999 }).toString().padStart(9, '0');
  return `${prefix}${number}`;
};

export const randomLearningStatus = () => {
  return faker.helpers.weightedArrayElement([
    { value: 'studying', weight: 30 },
    { value: 'graduated', weight: 60 },
    { value: 'on-hold', weight: 1 },
    { value: 'quit', weight: 10 },
  ]);
};
