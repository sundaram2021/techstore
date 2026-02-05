
import { NextResponse, type NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
    // Optimistic check for session cookie
    const sessionCookie = request.cookies.get("better-auth.session_token") || request.cookies.get("session_token");
 
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
