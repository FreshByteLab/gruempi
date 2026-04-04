import { auth } from "@/lib/gruempi/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest & { auth: { user?: { role?: string } } | null }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Admin routes require ADMIN role
  if (pathname.startsWith("/gruempi/admin")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/gruempi/login", req.url));
    }
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/gruempi", req.url));
    }
  }

  // Field entry requires ADMIN or SCORER role
  if (pathname.startsWith("/gruempi/feld")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/gruempi/login", req.url));
    }
    if (session.user.role !== "ADMIN" && session.user.role !== "SCORER") {
      return NextResponse.redirect(new URL("/gruempi", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/gruempi/admin/:path*", "/gruempi/feld/:path*", "/gruempi/feld"],
};
