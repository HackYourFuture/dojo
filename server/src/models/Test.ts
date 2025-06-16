import { TestResult, TestType } from './Trainee';

export interface Test {
  readonly id: string;
  date: Date;
  type: TestType;
  score?: number;
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
