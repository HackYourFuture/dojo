export enum TokenType {
  GoogleAccessTokenHash = 'google_access_token_hash',
}

export interface Token {
  readonly createdAt: Date;
  type: TokenType;
  payload: string;
  isValid: boolean;
}
