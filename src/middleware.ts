import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = ["/admin"];
const adminRoutes = ["admin", "/admin/users"];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // // Redirect root to dashboard
  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL("/dashboard", request.url));
  // }

  // Skip middleware for non-protected routes
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  try {
    const cookieName =
      process.env.NODE_ENV === "production"
        ? "__Secure-next-auth.session-token"
        : "next-auth.session-token";

    const token = await getToken({
      req: request,
      secret: process.env.JWT_SECRET,
      cookieName,
    });

    console.log("Cookies:", request.cookies.getAll());
    console.log("Token:", token);

    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // // Redirect unverified users to /my_role
    // if (!token.isVerified) {
    //   return NextResponse.redirect(new URL("/", request.url));
    // }

    // Restrict admin routes
    if (adminRoutes.includes(pathname) && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
