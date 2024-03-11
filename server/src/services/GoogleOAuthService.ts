export interface GoogleOAuthUserInfo {
  name: string;
  email: string;
  emailVerified: boolean;
  pictureUrl?: string;
}

export interface GoogleOAuthServiceType {
  getUserInfo(accessToken: string): Promise<GoogleOAuthUserInfo>;
}

export class GoogleOAuthService {
  async getUserInfo(accessToken: string): Promise<GoogleOAuthUserInfo> {
    const URL = "https://www.googleapis.com/oauth2/v3/userinfo";
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    };
    const response = await fetch(URL, { headers });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    const json: any = await response.json();
    return {
      email: json.email,
      name: json.name,
      emailVerified: json.email_verified,
      pictureUrl: json.picture,
    };
  }
}
