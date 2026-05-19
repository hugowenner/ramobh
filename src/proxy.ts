import { auth } from "@/core/auth/config";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/error"];

export default auth((req) => {
  const { nextUrl, auth: session } = req;
  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    nextUrl.pathname.startsWith(route)
  );

  if (!session && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (session && nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  // Protege tudo exceto:
  // - /api/auth/** (handlers do Auth.js)
  // - /api/uploads/** (serve arquivos locais sem auth no middleware — validado no handler)
  // - assets estáticos do Next.js
  matcher: [
    "/((?!api/auth|api/uploads|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
