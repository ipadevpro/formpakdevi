import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    if (!db) {
      return NextResponse.json({ error: "Firebase is not configured" }, { status: 500 });
    }

    const { answers } = await request.json();
    if (!answers) {
      return NextResponse.json({ error: "Missing submission answers" }, { status: 400 });
    }

    // Load form details to check schema constraints
    const formRef = db.collection("forms").doc(formId);
    const formDoc = await formRef.get();

    if (!formDoc.exists) {
      return NextResponse.json({ error: "Formulir tidak ditemukan" }, { status: 404 });
    }

    const formData = formDoc.data() || {};
    if (!formData.published) {
      return NextResponse.json({ error: "Formulir tidak aktif / draf" }, { status: 400 });
    }

    const fields = formData.fields || [];

    // Server-side validation of fields
    for (const field of fields) {
      const val = answers[field.id];

      // Required check
      if (field.required) {
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0) ||
          val === false
        ) {
          return NextResponse.json(
            { error: `Field "${field.label}" wajib diisi.` },
            { status: 400 }
          );
        }
      }

      // Pattern validation
      if (val) {
        if (field.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(val)) {
            return NextResponse.json(
              { error: `Format email pada "${field.label}" tidak valid.` },
              { status: 400 }
            );
          }
        }

        if (field.type === "number") {
          const num = Number(val);
          if (isNaN(num)) {
            return NextResponse.json(
              { error: `Field "${field.label}" harus berupa angka.` },
              { status: 400 }
            );
          }
          if (field.validation?.min !== undefined && num < field.validation.min) {
            return NextResponse.json(
              { error: `Nilai minimal "${field.label}" adalah ${field.validation.min}.` },
              { status: 400 }
            );
          }
          if (field.validation?.max !== undefined && num > field.validation.max) {
            return NextResponse.json(
              { error: `Nilai maksimal "${field.label}" adalah ${field.validation.max}.` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Capture basic client information
    const userAgent = request.headers.get("user-agent") || "";
    let deviceInfo = "Desktop";
    if (/mobile/i.test(userAgent)) {
      deviceInfo = "Mobile";
    } else if (/tablet/i.test(userAgent)) {
      deviceInfo = "Tablet";
    }

    // Write submission to collection and increment count in form atomically
    const batch = db.batch();
    const submissionRef = db.collection("submissions").doc();

    batch.set(submissionRef, {
      formId,
      answers,
      submittedAt: new Date(),
      deviceInfo,
    });

    batch.update(formRef, {
      submissionsCount: FieldValue.increment(1),
    });

    await batch.commit();

    return NextResponse.json({ status: "success", submissionId: submissionRef.id });
  } catch (error: any) {
    console.error("Submission error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
