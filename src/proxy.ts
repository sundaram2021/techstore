
import { NextResponse, type NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export default async function proxy(request: NextRequest) {
    // Handles both dev and production cookie names (including __Secure- prefix).
    const sessionCookie = getSessionCookie(request.headers);
 
    if (!sessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }
    return NextResponse.next();
}
 
export const config = {
    matcher: [
        // Match all paths except:
        // - api/auth routes (auth endpoints)
        // - _next (Next.js internals)
        // - static files (images, etc.)
        // - public routes: /, /sign-in, /sign-up
        '/((?!api/auth|_next/static|_next/image|favicon.ico|sign-in|sign-up|$).*)',
    ],
};
