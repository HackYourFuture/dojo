import {
  Background,
  EducationLevel,
  EnglishLevel,
  FinancialSupport,
  Gender,
  JobPath,
  LearningStatus,
  Pronouns,
  QuitReason,
  Track,
} from '../../../data/types/Trainee';
import { formatJobPathToLabel, formatTextToFriendly } from './formHelper';
import { getTrackLabel, learningStatusToLabel } from '../../../data/labels/traineeLabels';

// The options of every dropdown on the trainee profile and in the create dialog.

export type SelectOption = {
  label: string; // Shown to the user
  value: string;
};

export const genderOptions: SelectOption[] = [
  { label: 'Man', value: Gender.Man },
  { label: 'Woman', value: Gender.Woman },
  { label: 'Non-binary', value: Gender.NonBinary },
  { label: 'Other', value: Gender.Other },
];

export const pronounOptions: SelectOption[] = Object.values(Pronouns).map((pronouns) => ({
  label: pronouns,
  value: pronouns,
}));

export const backgroundOptions: SelectOption[] = [
  { label: 'EU citizen', value: Background.EUCitizen },
  { label: 'Family reunification', value: Background.FamilyReunification },
  { label: 'Partner of a skilled migrant', value: Background.PartnerOfSkilledMigrant },
  { label: 'Refugee', value: Background.Refugee },
  { label: 'Vulnerable group', value: Background.VulnerableGroup },
];

export const financialSupportOptions: SelectOption[] = Object.values(FinancialSupport).map((support) => ({
  label: formatTextToFriendly(support),
  value: support,
}));

export const englishLevelOptions: SelectOption[] = Object.values(EnglishLevel).map((level) => ({
  label: formatTextToFriendly(level),
  value: level,
}));

export const educationLevelOptions: SelectOption[] = [
  { label: 'None', value: EducationLevel.None },
  { label: 'High school', value: EducationLevel.HighSchool },
  { label: 'Diploma', value: EducationLevel.Diploma },
  { label: 'Bachelors degree', value: EducationLevel.BachelorsDegree },
  { label: 'Masters degree', value: EducationLevel.MastersDegree },
  { label: 'PhD', value: EducationLevel.PhD },
];

export const trackOptions: SelectOption[] = Object.values(Track).map((track) => ({
  label: getTrackLabel(track),
  value: track,
}));

export const learningStatusOptions: SelectOption[] = Object.values(LearningStatus).map((status) => ({
  label: learningStatusToLabel(status),
  value: status,
}));

export const quitReasonOptions: SelectOption[] = [
  { label: 'Technical', value: QuitReason.Technical },
  { label: 'Social skills', value: QuitReason.SocialSkills },
  { label: 'Personal', value: QuitReason.Personal },
  { label: 'Municipality or monetary', value: QuitReason.MunicipalityOrMonetary },
  { label: 'Left NL', value: QuitReason.LeftNL },
  { label: 'Withdrawn', value: QuitReason.Withdrawn },
  { label: 'Other', value: QuitReason.Other },
];

export const jobPathOptions: SelectOption[] = Object.values(JobPath).map((status) => ({
  label: formatJobPathToLabel(status),
  value: status,
}));

// For true/false fields. ProfileSelect turns the values back into booleans.
export const yesNoOptions: SelectOption[] = [
  { label: 'Yes', value: 'true' },
  { label: 'No', value: 'false' },
];
