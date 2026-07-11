import { NextRequest, NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE_NAME } from "./lib/auth";
import { canAccess, NavKey } from "./lib/permissions";

const ROUTE_TO_NAVKEY: Record<string, NavKey> = {
  "/dashboard": "dashboard",
  "/coins": "coins",
  "/payouts": "payouts",
  "/agencies": "agencies",
  "/users": "users",
  "/security": "security",
  "/customer-service": "customer-service",
  "/rooms": "rooms",
  "/admin-management": "admin-management",
  "/requests": "requests",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const raw = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = raw ? decodeSession(raw) : null;

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  const navKey = ROUTE_TO_NAVKEY[pathname];
  if (navKey && !canAccess(session, navKey)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/coins",
    "/payouts",
    "/agencies",
    "/users",
    "/security",
    "/customer-service",
    "/rooms",
    "/admin-management",
    "/requests",
  ],
};
