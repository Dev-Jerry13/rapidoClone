import { connectDB } from "@/lib/db/connect";
import { requireRole } from "@/lib/auth/guards";
import { ok, fail } from "@/lib/utils/response";
import { calculateFare } from "@/lib/utils/fare";
import Ride from "@/models/Ride";
import PricingRule from "@/models/PricingRule";

export async function GET() {
  const auth = await requireRole(["rider", "admin", "driver"]);
  if (!auth.ok) return fail(auth.message, auth.status);

  await connectDB();

  let query = {};
  if (auth.session.user.role === "rider") query.riderId = auth.session.user.id;
  if (auth.session.user.role === "driver") query.driverId = auth.session.user.id;

  const rides = await Ride.find(query).sort({ createdAt: -1 }).limit(100).lean();
  return ok({ rides });
}

export async function POST(req) {
  const auth = await requireRole(["rider"]);
  if (!auth.ok) return fail(auth.message, auth.status);

  await connectDB();

  const body = await req.json();
  const { pickup, dropoff, distanceKm, durationMin, action } = body;

  const pricing = await PricingRule.findOne({ active: true }).lean();
  if (!pricing) return fail("No active pricing rule found", 400);

  const fare = calculateFare({
    distanceKm,
    durationMin,
    baseFare: pricing.baseFare,
    perKm: pricing.perKm,
    perMinute: pricing.perMinute,
    minimumFare: pricing.minimumFare,
    surgeMultiplier: pricing.surgeMultiplier,
  });

  if (action === "estimate") {
    return ok({ fare });
  }

  const ride = await Ride.create({
    riderId: auth.session.user.id,
    pickup,
    dropoff,
    distanceKm,
    durationMin,
    fare,
    status: "requested",
  });

  // In production, publish to queue/socket dispatcher.
  return ok({ ride }, 201);
}
