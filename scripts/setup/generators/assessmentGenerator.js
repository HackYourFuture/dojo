import { faker } from '../random.js';

export const generateAssessment = (trainee) => {
  const score = getRandomScore();
  return {
    date: faker.date.future({ refDate: trainee.startDate }),
    type: faker.helpers.arrayElement(TEST_TYPES),
    result: getRandomTestResult(score),
    score: score,
    comments: '',
  };
};

const getRandomTestResult = (score) => {
  if (faker.datatype.boolean(0.01)) {
    return 'disqualified';
  }
  if (score === null) {
    return faker.helpers.arrayElement(['failed', 'passed-with-warning', 'passed']);
  }
  if (score < 6) {
    return 'failed';
  }
  if (score < 7) {
    return 'passed-with-warning';
  }
  return 'passed';
};

const getRandomScore = () => {
  const weightedRandomScore = faker.helpers.weightedArrayElement([
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

  if (weightedRandomScore === null) {
    return null;
  }

  return faker.number.float({ min: weightedRandomScore - 1, max: weightedRandomScore, fractionDigits: 1 });
};

const TEST_TYPES = [
  "final-project-interview",
  "core-mid-term-interview",
  "core-end-interview",
  "frontend-mid-term-interview",
  "backend-mid-term-interview",
  "cloud-mid-term-interview",
  "data-mid-term-interview",
  "tester-mid-term-interview",
];