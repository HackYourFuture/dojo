import { Country } from '../models';
import * as Sentry from '@sentry/node';

// From https://ipgeolocation.io/documentation/ip-geolocation-api.html
interface IPGeoLocationResponse {
  country_code2: string;
  country_name: string;
  country_emoji: string;
}

export interface IPGeoLocationServiceType {
  resolveCountry(ip: string): Promise<Country | null>;
}

export class IPGeoLocationService implements IPGeoLocationServiceType {
  private readonly apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async resolveCountry(ip: string): Promise<Country | null> {
    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${this.apiKey}&ip=${ip}`;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorResponse = (await response.json()) as { message: string };
        throw new Error(`Failed to fetch IP geolocation data: ${errorResponse.message}`);
      }

      const data = (await response.json()) as IPGeoLocationResponse;

      return {
        _id: data.country_code2,
        name: data.country_name,
        code: data.country_code2,
        flag: data.country_emoji,
      };
    } catch (error) {
      Sentry.captureException(error);
      return null;
    }
  }
}
