import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;
  
  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const sessionCookie = request.cookies.get("picklecart_admin_session");
    
    // If there's no valid session cookie, redirect to login
    if (!sessionCookie || sessionCookie.value !== "authenticated") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authenticated and visiting /admin/login, redirect directly to dashboard
  if (pathname === "/admin/login") {
    const sessionCookie = request.cookies.get("picklecart_admin_session");
    if (sessionCookie && sessionCookie.value === "authenticated") {
      return NextResponse.redirect(new URL("/admin/products", request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
