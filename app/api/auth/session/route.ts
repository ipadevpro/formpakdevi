import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { adminAuth } = await import("@/lib/firebase-admin");

    if (!adminAuth) {
      return NextResponse.json(
        { error: "Firebase Admin is not configured on this server." },
        { status: 500 }
      );
    }

    const { idToken } = await request.json();
    if (!idToken) {
      return NextResponse.json({ error: "Missing ID token" }, { status: 400 });
    }

    const expiresInMs = 60 * 60 * 24 * 5 * 1000;
    const expiresInSec = 60 * 60 * 24 * 5;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn: expiresInMs });

    const cookieStore = await cookies();
    cookieStore.set("session", sessionCookie, {
      maxAge: expiresInSec,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    console.error("Session creation error:", error);
    const message = error?.code === "auth/invalid-id-token"
      ? "Invalid ID token"
      : "Failed to create session";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.set("session", "", {
      maxAge: 0,
      path: "/",
    });
    return NextResponse.json({ status: "success" });
  } catch (error: any) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
