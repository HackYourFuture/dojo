import { Gender, LearningStatus } from '../../src/models/Trainee';
import { faker } from '@faker-js/faker';

export const getRandomGender = (): Gender => {
  return faker.helpers.weightedArrayElement([
    { value: Gender.Man, weight: 50 },
    { value: Gender.Woman, weight: 50 },
    { value: Gender.NonBinary, weight: 1 },
  ]);
};

export const getNameGender = (gender: Gender): 'male' | 'female' => {
  if (gender === Gender.Man) {
    return 'male';
  }
  if (gender === Gender.Woman) {
    return 'female';
  }
  return faker.person.sexType();
};

export const getPronouns = (gender: Gender): string => {
  if (gender === Gender.Man) {
    return 'He/him';
  }
  if (gender === Gender.Woman) {
    return 'She/her';
  }
  return 'They/them';
};

export const getRandomPhoneNumber = () => {
  const prefix = '+316';
  const number = faker.number.int({ min: 0, max: 99999999 }).toString().padStart(9, '0');
  return `${prefix}${number}`;
};

export const randomStrikeNumber = () => {
  return faker.helpers.weightedArrayElement([
    { value: 0, weight: 20 },
    { value: 1, weight: 40 },
    { value: 2, weight: 50 },
    { value: 3, weight: 60 },
    { value: 4, weight: 20 },
    { value: 5, weight: 15 },
    { value: 6, weight: 10 },
    { value: 7, weight: 5 },
    { value: 8, weight: 2 },
    { value: 9, weight: 1 },
    { value: 10, weight: 0.1 },
  ]);
};

export const randomLearningStatus = (): LearningStatus => {
  return faker.helpers.weightedArrayElement([
    { value: LearningStatus.Studying, weight: 30 },
    { value: LearningStatus.Graduated, weight: 60 },
    { value: LearningStatus.OnHold, weight: 1 },
    { value: LearningStatus.Quit, weight: 10 },
  ]);
};
