export interface Assessment {
  readonly id: string;
  date: Date;
  type: AssessmentType;
  score: number | null;
  result: AssessmentResult;
  comments: string | null;
}

export interface TraineeAssessments {
  averageScore: number | null;
  assessments: Assessment[];
}

export enum AssessmentResult {
  Passed = 'PASSED',
  PassedWithWarning = 'PASSED_WITH_WARNING',
  Failed = 'FAILED',
  Disqualified = 'DISQUALIFIED',
}

export enum AssessmentType {
  Presentation = 'PRESENTATION',
  JavaScript = 'JAVASCRIPT',
  BrowsersInterview = 'BROWSERS_INTERVIEW',
  UsingApisInterview = 'USING_APIS_INTERVIEW',
  NodeJS = 'NODEJS',
  ReactInterview = 'REACT_INTERVIEW',
  FinalProjectInterview = 'FINAL_PROJECT_INTERVIEW',
  CoreMidTermInterview = 'CORE_MID_TERM_INTERVIEW',
  CoreEndInterview = 'CORE_END_INTERVIEW',
  FrontEndMidTermInterview = 'FRONTEND_MID_TERM_INTERVIEW',
  BackEndMidTermInterview = 'BACKEND_MID_TERM_INTERVIEW',
  CloudMidTermInterview = 'CLOUD_MID_TERM_INTERVIEW',
  DataMidTermInterview = 'DATA_MID_TERM_INTERVIEW',
  TesterMidTermInterview = 'TESTER_MID_TERM_INTERVIEW',
}
