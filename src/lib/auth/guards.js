import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";

export async function requireRole(allowedRoles = []) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return { ok: false, status: 401, message: "Unauthorized" };
  }

  if (allowedRoles.length && !allowedRoles.includes(session.user.role)) {
    return { ok: false, status: 403, message: "Forbidden" };
  }

  return { ok: true, session };
}
