import { Schema } from "mongoose";
import { Token, TokenType } from "../models/Token";

const ONE_WEEK = 7 * 24 * 60 * 60;

const TokenSchema: Schema = new Schema<Token>({
  createdAt: { type: Date, expires: ONE_WEEK }, 
  type: {
    type: String,
    required: true,
    enum: Object.values(TokenType),
  },
  payload: { type: String, required: true, index: true },
  isValid: { type: Boolean, required: true },
});

export default TokenSchema;
