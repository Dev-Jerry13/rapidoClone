import { connectDB } from "@/lib/db/connect";
import { requireRole } from "@/lib/auth/guards";
import { ok, fail } from "@/lib/utils/response";
import DriverProfile from "@/models/DriverProfile";

export async function PATCH(req) {
  const auth = await requireRole(["driver"]);
  if (!auth.ok) return fail(auth.message, auth.status);

  const { online, coordinates } = await req.json();
  await connectDB();

  const profile = await DriverProfile.findOneAndUpdate(
    { userId: auth.session.user.id, approvalStatus: "approved" },
    {
      online,
      ...(coordinates
        ? {
            currentLocation: {
              type: "Point",
              coordinates,
            },
          }
        : {}),
    },
    { new: true }
  );

  if (!profile) return fail("Driver profile not approved or missing", 404);
  return ok({ profile });
}
