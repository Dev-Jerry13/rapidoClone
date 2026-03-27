import { connectDB } from "@/lib/db/connect";
import { requireRole } from "@/lib/auth/guards";
import { ok, fail } from "@/lib/utils/response";
import Complaint from "@/models/Complaint";

export async function GET() {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return fail(auth.message, auth.status);

  await connectDB();
  const complaints = await Complaint.find().sort({ createdAt: -1 }).lean();
  return ok({ complaints });
}

export async function POST(req) {
  const auth = await requireRole(["rider", "driver"]);
  if (!auth.ok) return fail(auth.message, auth.status);

  await connectDB();
  const body = await req.json();

  const complaint = await Complaint.create({
    ...body,
    raisedBy: auth.session.user.id,
  });

  return ok({ complaint }, 201);
}

export async function PATCH(req) {
  const auth = await requireRole(["admin"]);
  if (!auth.ok) return fail(auth.message, auth.status);

  await connectDB();
  const { complaintId, status, resolutionNote } = await req.json();

  const complaint = await Complaint.findByIdAndUpdate(
    complaintId,
    { status, resolutionNote },
    { new: true }
  );

  return ok({ complaint });
}
