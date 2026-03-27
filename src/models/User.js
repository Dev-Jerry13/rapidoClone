import mongoose, { Schema } from "mongoose";
import { ROLES } from "@/config/roles";

const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String },
    phone: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.RIDER,
      index: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
