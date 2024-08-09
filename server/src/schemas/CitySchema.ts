import { Schema } from 'mongoose';
import { City } from '../models/City';

const CitySchema: Schema = new Schema<City>({
  name: { type: String, required: true, index: true },
  alternateNames: { type: [String], required: true, index: true },
  coordinates: {
    lon: { type: Number, required: false },
    lat: { type: Number, required: false },
    _id: false,
  },
  population: { type: Number, required: true },
  country_code: { type: String, required: true },
});

export { CitySchema };
