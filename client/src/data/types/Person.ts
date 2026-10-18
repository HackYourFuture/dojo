import { SelectOption } from './SelectOption';

// How a person describes their gender, like the server's Gender.
export enum Gender {
  Man = 'MAN',
  Woman = 'WOMAN',
  NonBinary = 'NON_BINARY',
  Other = 'OTHER',
}

export const genderOptions: SelectOption[] = [
  { label: 'Man', value: Gender.Man },
  { label: 'Woman', value: Gender.Woman },
  { label: 'Non-binary', value: Gender.NonBinary },
  { label: 'Other', value: Gender.Other },
];

// The pronouns offered in the profiles. The API stores pronouns as free text.
export enum Pronouns {
  HeHim = 'He/him',
  SheHer = 'She/her',
  TheyThem = 'They/them',
  HeThey = 'He/they',
  SheThey = 'She/they',
}

export const pronounOptions: SelectOption[] = Object.values(Pronouns).map((pronouns) => ({
  label: pronouns,
  value: pronouns,
}));
