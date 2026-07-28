import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db as firestoreDb, adminAuth as firebaseAdminAuth } from "@/lib/firebase-admin";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    if (!firestoreDb || !firebaseAdminAuth) {
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
      decodedClaims = await firebaseAdminAuth.verifySessionCookie(session, true);
    } catch (e) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = decodedClaims.uid;
    const body = await request.json();
    const { name, description, published, slug, fields } = body;

    if (!name) {
      return NextResponse.json({ error: "Judul form wajib diisi" }, { status: 400 });
    }

    // Reference to target form document
    const formRef = firestoreDb.collection("forms").doc(formId);
    const formDoc = await formRef.get();

    if (!formDoc.exists) {
      return NextResponse.json({ error: "Formulir tidak ditemukan" }, { status: 404 });
    }

    const formData = formDoc.data();
    if (formData?.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Slug validation and uniqueness check
    let finalizedSlug = slug
      ? slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "")
      : formId;

    if (!finalizedSlug) {
      finalizedSlug = formId;
    }

    // Check if slug has changed, and if so, check uniqueness
    const currentSlug = formData?.slug;
    if (finalizedSlug !== currentSlug) {
      const slugRef = firestoreDb.collection("slugs").doc(finalizedSlug);
      const slugDoc = await slugRef.get();

      if (slugDoc.exists) {
        const slugData = slugDoc.data();
        if (slugData?.formId !== formId) {
          // Slug is taken by another form. Let's make it unique by appending a random ID
          finalizedSlug = `${finalizedSlug}-${Math.random().toString(36).substring(2, 6)}`;
        }
      }

      // Update lookup index: delete old slug index, create new slug index
      const batch = firestoreDb.batch();
      if (currentSlug) {
        batch.delete(firestoreDb.collection("slugs").doc(currentSlug));
      }
      batch.set(firestoreDb.collection("slugs").doc(finalizedSlug), {
        formId,
        userId,
      });
      await batch.commit();
    }

    // Update form document
    await formRef.update({
      name,
      description: description || "",
      published: !!published,
      slug: finalizedSlug,
      fields: fields || [],
      updatedAt: new Date(),
    });

    return NextResponse.json({
      status: "success",
      slug: finalizedSlug,
    });
  } catch (error: any) {
    console.error("Save form error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
