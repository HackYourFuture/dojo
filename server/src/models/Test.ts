import { TestResult, TestType } from './Trainee';

export interface Test {
  readonly id: string;
  date: Date;
  type: TestType;
  score: number | null;
  result: TestResult;
  comments?: string;
}

export const validateTest = (test: Test): void => {
  if (!test.date) {
    throw new Error('Test date is required');
  }
  if (!test.result || !Object.values(TestResult).includes(test.result)) {
    throw new Error(`Unknown test result [${Object.values(TestResult)}]`);
  }
  if (!test.type || !Object.values(TestType).includes(test.type)) {
    throw new Error(`Unknown test type [${Object.values(TestType)}]`);
  }
};

// Calculate average of all test scores, taking only the highest score for each test type
export const calculateAverageTestScore = (tests: Test[]): number | null => {
  // Group by test type
  const testTypes = Object.groupBy(tests, (test) => test.type);

  // Select highest test for each type
  const scores = Object.values(testTypes)
    .map((testsWithTheSameType) => {
      return getTestWithMaxScore(testsWithTheSameType);
    })
    .map((test) => test?.score)
    .filter((score) => score !== null && score !== undefined);

  // Filter out tests without scores
  if (scores.length === 0) {
    return null;
  }

  // Calculate average
  const sum = scores.reduce((acc, score) => {
    return acc + score;
  }, 0);
  return sum / scores.length;
};

// Helper function to get the best test (highest score) from a list of tests
const getTestWithMaxScore = (tests: Test[]): Test | null => {
  const sortedByScore = tests
    .filter((test: Test) => Number.isFinite(test.score))
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return sortedByScore[0] ?? null;
};
