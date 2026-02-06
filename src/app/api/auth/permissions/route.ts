import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return NextResponse.json({ authenticated: false, isAdmin: false });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const isAdmin = !!adminEmail && session.user.email === adminEmail;

  return NextResponse.json({
    authenticated: true,
    isAdmin,
    userEmail: session.user.email,
    userName: session.user.name ?? null,
  });
}
