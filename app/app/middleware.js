// // app/middleware.js
// import { getToken } from "next-auth/jwt";
// import { NextResponse } from "next/server";

// export async function middleware(req) {
//   const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

//   const { pathname } = req.nextUrl;

//   // Allow public routes
//   if (pathname.startsWith("/auth") || pathname.startsWith("/api")) return NextResponse.next();

//   // Redirect if not logged in
//   if (!token) {
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   // Example: protect admin routes
//   if (pathname.startsWith("/admin") && token.role !== "admin") {
//     return NextResponse.redirect(new URL("/user/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = { matcher: ["/user/:path*", "/admin/:path*"] };
