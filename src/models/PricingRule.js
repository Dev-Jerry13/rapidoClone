import mongoose, { Schema } from "mongoose";

const PricingRuleSchema = new Schema(
  {
    city: { type: String, required: true, unique: true },
    baseFare: { type: Number, required: true },
    perKm: { type: Number, required: true },
    perMinute: { type: Number, required: true },
    minimumFare: { type: Number, required: true },
    surgeMultiplier: { type: Number, default: 1 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.PricingRule || mongoose.model("PricingRule", PricingRuleSchema);
