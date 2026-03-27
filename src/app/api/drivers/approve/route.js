import { connectDB } from "@/lib/db/connect";
import { requireRole } from "@/lib/auth/guards";
import { ok, fail } from "@/lib/utils/response";
import DriverProfile from "@/models/DriverProfile";

export async function PATCH(req) {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return fail(auth.message, auth.status);

  const { userId, approvalStatus } = await req.json();

  if (!["approved", "rejected", "pending"].includes(approvalStatus)) {
    return fail("Invalid approvalStatus", 400);
  }

  await connectDB();
  const profile = await DriverProfile.findOneAndUpdate(
    { userId },
    { approvalStatus },
    { new: true }
  );

  if (!profile) return fail("Driver profile not found", 404);
  return ok({ profile });
}
