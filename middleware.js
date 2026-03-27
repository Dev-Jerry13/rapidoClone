export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/rider/:path*", "/driver/:path*", "/admin/:path*"],
};
