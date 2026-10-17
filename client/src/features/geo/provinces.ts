import { SelectOption } from '../../data/types/SelectOption';

// The provinces as the cities store them, in English, to filter the lists by.
const PROVINCES = [
  'Drenthe',
  'Flevoland',
  'Friesland',
  'Gelderland',
  'Groningen',
  'Limburg',
  'North Brabant',
  'North Holland',
  'Overijssel',
  'South Holland',
  'Utrecht',
  'Zeeland',
];

export const provinceOptions: SelectOption[] = PROVINCES.map((province) => ({ label: province, value: province }));
