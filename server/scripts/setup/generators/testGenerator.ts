import { faker } from '@faker-js/faker';
import { Test } from '../../../src/models/Test';
import { Trainee, TestResult, TestType } from '../../../src/models/Trainee';

export const generateTest = (trainee: Trainee): Test => {
  const score = getRandomScore();
  return {
    id: '',
    date: faker.date.future({ refDate: trainee.educationInfo.startDate }),
    type: faker.helpers.arrayElement(Object.values(TestType)),
    result: getRandomTestResult(score),
    score: score,
    comments: '',
  };
};

const getRandomTestResult = (score: number | null): TestResult => {
  if (faker.datatype.boolean(0.01)) {
    return TestResult.Disqualified;
  }
  if (score === null) {
    return faker.helpers.arrayElement(Object.values(TestResult));
  }
  if (score < 6) {
    return TestResult.Failed;
  }
  if (score < 7) {
    return TestResult.PassedWithWarning;
  }
  return TestResult.Passed;
};

const getRandomScore = (): number | null => {
  const getWeightedRandomScore: number | null = faker.helpers.weightedArrayElement([
    { value: null, weight: 10 },
    { value: 1, weight: 1 },
    { value: 2, weight: 2 },
    { value: 3, weight: 2 },
    { value: 4, weight: 5 },
    { value: 5, weight: 10 },
    { value: 6, weight: 15 },
    { value: 7, weight: 20 },
    { value: 8, weight: 30 },
    { value: 9, weight: 20 },
    { value: 10, weight: 10 },
  ]);

  if (getWeightedRandomScore === null) {
    return null;
  }

  return faker.number.float({ min: getWeightedRandomScore - 1, max: getWeightedRandomScore, fractionDigits: 1 });
};
