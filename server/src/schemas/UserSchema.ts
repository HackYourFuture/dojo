import { Schema } from "mongoose";
import { User, WithMongoID } from "../models";
import { genId } from "../utils/random";

const UserSchema: Schema = new Schema<User & WithMongoID>({
  _id: { type: String, default: genId },
  name: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String, required: false },
  isActive: { type: Boolean, required: true },
});

const convertObject = {
  virtuals: true,
  versionKey: false,
  transform: (_: any, ret: any) => {
    delete ret._id;
  },
};

UserSchema.set("toJSON", convertObject);
UserSchema.set("toObject", convertObject);

export { UserSchema };
