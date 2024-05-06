/**
 * Mongoose schema for user domain
 */
import mongoose from "mongoose";
//
import validator from "validator";
import { CONTACT_METHODS, DATA_STATUS_TYPES } from "../config/constants.js";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email");
        }
      },
    },
    phoneNumber: {
      type: String,
      trim: true,
    },
    contactMethods: {
      type: [String],
      enum: CONTACT_METHODS,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Roles",
        autopopulate: true,
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    dataStatus: {
      type: String,
      default: DATA_STATUS_TYPES.ACTIVE,
      enum: [DATA_STATUS_TYPES],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
//
userSchema.statics.isEmailTaken = async (email, excludeUserId) => {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};
//
userSchema.statics.isUsernameTaken = async (username, excludeUserId) => {
  const user = await this.findOne({ username, _id: { $ne: excludeUserId } });
  return !!user;
};

const User = mongoose.model("User", userSchema);
//
export default User;
