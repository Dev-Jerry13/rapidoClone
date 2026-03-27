import mongoose, { Schema } from "mongoose";

const ComplaintSchema = new Schema(
  {
    rideId: { type: Schema.Types.ObjectId, ref: "Ride", required: true },
    raisedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    against: { type: Schema.Types.ObjectId, ref: "User", required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "investigating", "resolved", "rejected"],
      default: "open",
    },
    resolutionNote: String,
  },
  { timestamps: true }
);

export default mongoose.models.Complaint || mongoose.model("Complaint", ComplaintSchema);
