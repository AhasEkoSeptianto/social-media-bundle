// middleware.ts (taruh di ROOT project, sejajar dengan folder app/, bukan di dalam app/)
import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "session_token"; // samakan dengan COOKIE_NAME di backend Express

// Halaman yang WAJIB login untuk diakses
const protectedRoutes = ["/", "/profile", "/explore"];

// Halaman yang TIDAK BOLEH diakses kalau sudah login (misal: login/register)
const authRoutes = ["/login", "/register"];

export function middleware(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.includes(pathname); // exact match untuk '/'

  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Belum login tapi coba akses halaman terproteksi -> redirect ke login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname); // biar bisa balik ke sini setelah login
    return NextResponse.redirect(loginUrl);
  }

  // Sudah login tapi buka halaman login/register -> redirect ke dashboard
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
    "/register",
  ],
};
