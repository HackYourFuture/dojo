import mongoose from "mongoose";
import { City, Country } from "../models";
import { CitySchema, CountrySchema } from "../schemas";
import { escapeStringRegexp } from "../utils/string";

export interface GeographyRepository {
  searchCountry(query: string, limit: number): Promise<Country[]>;
  searchCity(query: string, limit: number): Promise<City[]>;
}

export class MongooseGeographyRepository implements GeographyRepository {
  private readonly CityModel: mongoose.Model<City>;
  private readonly CountryModel: mongoose.Model<Country>;

  constructor(db: mongoose.Connection) {
    this.CityModel = db.model<City>("City", CitySchema);
    this.CountryModel = db.model<Country>("Country", CountrySchema);
  }

  async searchCountry(query: string, limit: number): Promise<Country[]> {
    const escapedQuery = escapeStringRegexp(query);
    return await this.CountryModel.find({
        name: { $regex: escapedQuery, $options: "i" }
    })
    .limit(limit)
    .sort({ name: 1 });
  }

  async searchCity(query: string, limit: number): Promise<City[]> {
    const escapedQuery = escapeStringRegexp(query);
    console.log(escapedQuery)
    return await this.CityModel.find({
      $or: [
        { name: { $regex: escapedQuery, $options: "i" } },
        { alternate_names: { $regex: escapedQuery, $options: "i" } }
      ]
    })
    .limit(limit)
    .sort({ population: -1, name: 1 });
  }
}
