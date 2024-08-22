import { Country } from '../models';
import { IPGeolocationRepository } from '../repositories';
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
  private readonly geolocationRepository: IPGeolocationRepository;
  private readonly apiKey: string;
  constructor(apiKey: string, geolocationRepository: IPGeolocationRepository) {
    this.apiKey = apiKey;
    this.geolocationRepository = geolocationRepository;
  }

  async resolveCountry(ip: string): Promise<Country | null> {
    // Check if the IP is already cached to avoid unnecessary API calls
    const cachedResult = await this.geolocationRepository.findIP(ip);
    if (cachedResult) {
      return cachedResult.country;
    }

    const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${this.apiKey}&ip=${ip}`;
    try {
      const response = await fetch(url);

      if (!response.ok) {
        const errorResponse = (await response.json()) as { message: string };
        throw new Error(`Failed to fetch IP geolocation data: ${errorResponse.message}`);
      }

      const data = (await response.json()) as IPGeoLocationResponse;
      const country: Country = {
        _id: data.country_code2,
        name: data.country_name,
        code: data.country_code2,
        flag: data.country_emoji,
      };

      // Cache the result to reduce the number of API calls in the future
      this.geolocationRepository.setIP(ip, country.code).catch((error) => {
        Sentry.captureException(error);
      });

      return country;
    } catch (error) {
      Sentry.captureException(error);
      return null;
    }
  }
}
