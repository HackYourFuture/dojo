import mongoose from 'mongoose';
import { DBIPGeolocation, IPGeolocation } from '../models';
import { IPGeolocationSchema } from '../schemas';

export interface IPGeolocationRepository {
  setIP(ip: string, countryCode: string): Promise<void>;
  findIP(ip: string): Promise<IPGeolocation | null>;
}

export class MongooseIPGeolocationRepository implements IPGeolocationRepository {
  private IPGeolocationModel: mongoose.Model<DBIPGeolocation>;

  constructor(db: mongoose.Connection) {
    this.IPGeolocationModel = db.model<DBIPGeolocation>('IPGeolocation', IPGeolocationSchema);
  }

  async setIP(ip: string, countryCode: string): Promise<void> {
    await this.IPGeolocationModel.findOneAndUpdate({ ip }, { countryCode }, { upsert: true });
  }

  async findIP(ip: string): Promise<IPGeolocation | null> {
    const result = await this.IPGeolocationModel.findOne<IPGeolocation>({ ip }).populate('countryCode').exec();
    if (!result) {
      return null;
    }
    return {
      ip: result.ip,
      country: result.country,
    };
  }
}
