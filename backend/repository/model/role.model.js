/**
 * @file role model
 * @summary Mongoose schema for role domain
 */
import mongoose from "mongoose";
//
import { DATA_STATUS_TYPES, ROLE_TYPES } from "../config/constants.js";


const roleSchema = mongoose.Schema(
  {
    type: {
      type: String,
      enum: [ROLE_TYPES.SYSTEM, ROLE_TYPES.CUSTOM],
    },
    name: {
      type: String,
      trim: true,
    },
    dataStatus: {
      type: String,
      enum: [DATA_STATUS_TYPES],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

roleSchema.statics.isRoleNameTaken = async (name, excludeId) => {
  const role = await this.findOne({ name, _id: { $ne: excludeId } });
  return !!role;
};
//
const Role = mongoose.model("Roles", roleSchema);
//
export default Role;
