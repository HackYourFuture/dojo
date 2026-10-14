export interface Country {
  // The ISO 3166-1 alpha-2 code, like NL.
  readonly id: string;
  name: string;
  alternativeNames: string[];
  // 0 when unknown.
  population: number;
  flag: string;
}
