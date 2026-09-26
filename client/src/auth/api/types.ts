export interface GoogleLoginRequest {
  authCode: string;
  redirectURI: string;
}

export interface SessionResponse {
  userId: string;
  name: string;
  email: string;
  pictureUrl: string | null;
}
