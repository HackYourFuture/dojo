export interface Assessment {
  readonly id: string;
  date: Date;
  type: AssessmentType;
  score: number | null;
  result: AssessmentResult;
  comments: string | null;
}

// The assessments of a trainee, with the average the API works out from their best score per type.
export interface TraineeAssessments {
  averageScore: number | null;
  assessments: Assessment[];
}

export enum AssessmentResult {
  Passed = 'passed',
  PassedWithWarning = 'passed-with-warning',
  Failed = 'failed',
  Disqualified = 'disqualified',
}

export enum AssessmentType {
  Presentation = 'presentation',
  JavaScript = 'javascript',
  BrowsersInterview = 'browsers-interview',
  UsingApisInterview = 'using-apis-interview',
  NodeJS = 'nodejs',
  ReactInterview = 'react-interview',
  FinalProjectInterview = 'final-project-interview',
  CoreMidTermInterview = 'core-mid-term-interview',
  CoreEndInterview = 'core-end-interview',
  FrontEndMidTermInterview = 'frontend-mid-term-interview',
  BackEndMidTermInterview = 'backend-mid-term-interview',
  CloudMidTermInterview = 'cloud-mid-term-interview',
  DataMidTermInterview = 'data-mid-term-interview',
  TesterMidTermInterview = 'tester-mid-term-interview',
}
