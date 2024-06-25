// This type is used to add a _id field to a model when interacting with MongoDB. 
// It is required when creating mongoose schemas and models.
export type WithMongoID = { _id: string };

export const jsonFormatting = {   
  virtuals: true,
  versionKey: false,
  minimize: false,
  transform: (_: any, ret: any) => {
    delete ret._id;
    delete ret.reporterID;
  },
}

