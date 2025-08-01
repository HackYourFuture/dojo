// This type is used to add a _id field to a model when interacting with MongoDB.

import { ToObjectOptions } from 'mongoose';

// It is required when creating mongoose schemas and models.
export interface WithMongoID {
  _id: string;
}

export const jsonFormatting: ToObjectOptions = {
  virtuals: true,
  versionKey: false,
  minimize: false,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.reporterID;
  },
};
