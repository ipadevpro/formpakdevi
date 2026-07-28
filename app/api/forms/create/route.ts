import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db, adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
  try {
    if (!db || !adminAuth) {
      return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 });
    }

    // Verify session cookie
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let decodedClaims;
    try {
      decodedClaims = await adminAuth.verifySessionCookie(session, true);
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = decodedClaims.uid;
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Nama formulir wajib diisi" }, { status: 400 });
    }

    // Generate random form ID and default unique short slug
    const formRef = db.collection("forms").doc();
    const formId = formRef.id;
    // Generate a simple 8-char random slug helper
    const randomSlug = `${formId.substring(0, 8)}`;

    const batch = db.batch();

    // 1. Create form document
    batch.set(formRef, {
      userId,
      name,
      description: description || "",
      slug: randomSlug,
      published: false,
      fields: [],
      visits: 0,
      submissionsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 2. Index the default slug in unique slugs lookup table
    const slugRef = db.collection("slugs").doc(randomSlug);
    batch.set(slugRef, {
      formId,
      userId,
    });

    await batch.commit();

    return NextResponse.json({ status: "success", formId, slug: randomSlug });
  } catch (error: any) {
    console.error("Create form error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
