import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
    const sessionCookie = getSessionCookie(request);

    // Check if the user is trying to access protected routes
    const isAuthRoute = request.nextUrl.pathname.startsWith("/api/auth");
    const isLoginPage = request.nextUrl.pathname.startsWith("/login");
    const isPublicAsset = request.nextUrl.pathname.startsWith("/_next") ||
        request.nextUrl.pathname.startsWith("/static") ||
        request.nextUrl.pathname.includes(".");

    if (!sessionCookie && !isAuthRoute && !isLoginPage && !isPublicAsset) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect to home if user is already logged in and tries to access login page
    if (sessionCookie && isLoginPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    // Apply to all routes except the ones we explicitly handle redirection logic for inside
    matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
