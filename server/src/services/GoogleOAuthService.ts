export interface GoogleOAuthUserInfo {
  name: string;
  email: string;
  emailVerified: boolean;
  pictureUrl?: string;
}

export interface GoogleOAuthServiceType {
  getUserInfo(accessToken: string): Promise<GoogleOAuthUserInfo>;
  exchangeAuthCodeForToken(code: string, redirectURI: string): Promise<string>;
  revokeToken(accessToken: string): Promise<void>;
}

export class GoogleOAuthService {

  private readonly clientId: string;
  private readonly clientSecret: string;
  
  constructor(clientId: string, clientSecret: string) {
    if (!clientId.trim()) {
      throw new Error("Missing required configuration: clientId");
    }
    if (!clientId.trim()) {
      throw new Error("Missing required configuration: clientSecret");
    }

    this.clientId = clientId.trim();
    this.clientSecret = clientSecret.trim();
  }

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

  async exchangeAuthCodeForToken(code: string, redirectURI: string): Promise<string> {
    // https://developers.google.com/identity/protocols/oauth2/web-server#exchange-authorization-code
    const URL = "https://oauth2.googleapis.com/token";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const body = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: redirectURI.trim(),
      grant_type: "authorization_code",
    });

    const response = await fetch(URL, { method: "POST", headers, body });

    if (!response.ok) {
      throw new Error(`Failed to Google OAuth exchange token: ${response.statusText}`);
    }

    const json: any = await response.json();
    return json.access_token;
  }
  
  async revokeToken(accessToken: string): Promise<void> {
    // https://developers.google.com/identity/protocols/oauth2/web-server#tokenrevoke
    const URL = "https://oauth2.googleapis.com/revoke";
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
    };
    const body = new URLSearchParams({
      token: accessToken,
    });

    const response = await fetch(URL, { method: "POST", headers, body });
    if (!response.ok) {
      throw new Error(`Failed to revoke Google OAuth token: ${response.statusText}`);
    }
  }
}
