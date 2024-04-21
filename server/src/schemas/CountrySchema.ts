import { Schema } from "mongoose";
import { Country } from "../models/Country";

const CountrySchema: Schema = new Schema<Country>({
  _id: { type: String },
  name: { type: String, required: true, index: true },
  code: { type: String, required: true },
  flag: { type: String, required: true },
});

export { CountrySchema };
