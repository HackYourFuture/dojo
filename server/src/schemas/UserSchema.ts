import { Schema } from "mongoose";
import { User } from "../models/User";

const UserSchema: Schema = new Schema<User>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  imageUrl: { type: String, required: false },
  isActive: { type: Boolean, required: true },
});

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    delete ret._id;
  },
});

export default UserSchema;
