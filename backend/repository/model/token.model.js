/**
 * Mongoose schema for token domain
 */
import mongoose from "mongoose";
//
import { TOKEN_STATUS, TOKEN_TYPES } from "../config/constants.js";

const tokenSchema = mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [TOKEN_TYPES],
      required: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: [TOKEN_STATUS],
      default: TOKEN_STATUS.PENDING,
    },
  },
  {
    timestamps: true,
  }
);
//
const Token = mongoose.model("Token", tokenSchema);
//
export default Token;
