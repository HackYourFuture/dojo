import { Schema } from 'mongoose';
import { DBIPGeolocation } from '../models';
import { jsonFormatting } from '../utils/database';

const IPGeolocationSchema: Schema = new Schema<DBIPGeolocation>({
  ip: { type: String, required: true, unique: true, index: true },
  countryCode: { type: String, required: true, ref: 'Country', alias: 'country', regex: /^[A-Z]{2}$/ },
});

IPGeolocationSchema.set('toJSON', jsonFormatting);
IPGeolocationSchema.set('toObject', jsonFormatting);

export { IPGeolocationSchema };
