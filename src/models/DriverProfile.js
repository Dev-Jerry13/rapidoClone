import mongoose, { Schema } from "mongoose";

const DriverProfileSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
    online: { type: Boolean, default: false, index: true },
    currentLocation: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] },
    },
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        verified: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

DriverProfileSchema.index({ currentLocation: "2dsphere" });

export default mongoose.models.DriverProfile || mongoose.model("DriverProfile", DriverProfileSchema);
