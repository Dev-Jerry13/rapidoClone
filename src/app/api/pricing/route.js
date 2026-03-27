import { connectDB } from "@/lib/db/connect";
import { requireRole } from "@/lib/auth/guards";
import { ok, fail } from "@/lib/utils/response";
import PricingRule from "@/models/PricingRule";

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return fail(auth.message, auth.status);

  await connectDB();
  const pricing = await PricingRule.find().sort({ updatedAt: -1 }).lean();
  return ok({ pricing });
}

export async function PATCH(req) {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return fail(auth.message, auth.status);

  const { city, ...updates } = await req.json();
  await connectDB();

  const pricing = await PricingRule.findOneAndUpdate({ city }, updates, {
    upsert: true,
    new: true,
  });

  return ok({ pricing });
}
