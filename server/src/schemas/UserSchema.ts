import { Schema } from "mongoose";
import { User } from "../models";
import { genId } from "../utils/random";
import { WithMongoID, jsonFormatting } from "../utils/database";

const UserSchema: Schema = new Schema<User & WithMongoID>({
  _id: { type: String, default: genId },
  name: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String, required: false },
  isActive: { type: Boolean, required: true },
});

UserSchema.set("toJSON", jsonFormatting);
UserSchema.set("toObject", jsonFormatting);

export { UserSchema };
