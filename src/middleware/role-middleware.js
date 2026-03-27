import { NextResponse } from "next/server";

const routeRoleMap = [
  { prefix: "/rider", role: "rider" },
  { prefix: "/driver", role: "driver" },
  { prefix: "/admin", role: "admin" },
];

export function enforceRole(req) {
  const token = req.nextauth?.token;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const path = req.nextUrl.pathname;
  const matched = routeRoleMap.find((item) => path.startsWith(item.prefix));

  if (matched && token.role !== matched.role) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
