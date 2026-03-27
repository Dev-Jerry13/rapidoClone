import mongoose, { Schema } from "mongoose";

const RideSchema = new Schema(
  {
    riderId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    driverId: { type: Schema.Types.ObjectId, ref: "User", index: true },
    pickup: {
      address: String,
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
      },
    },
    dropoff: {
      address: String,
      location: {
        type: { type: String, enum: ["Point"], default: "Point" },
        coordinates: { type: [Number], required: true },
      },
    },
    distanceKm: Number,
    durationMin: Number,
    fare: { type: Number, required: true },
    status: {
      type: String,
      enum: ["requested", "accepted", "arriving", "in_progress", "completed", "cancelled"],
      default: "requested",
      index: true,
    },
    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

RideSchema.index({ "pickup.location": "2dsphere" });
RideSchema.index({ "dropoff.location": "2dsphere" });

export default mongoose.models.Ride || mongoose.model("Ride", RideSchema);
