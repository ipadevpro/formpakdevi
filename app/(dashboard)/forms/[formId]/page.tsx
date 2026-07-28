import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db, adminAuth } from "@/lib/firebase-admin";
import { FormBuilder } from "@/components/builder/form-builder";
import { Form, FormField } from "@/lib/types";

// Force dynamic rendering to prevent static compilation crash with dynamic parameter forms
export const dynamic = "force-dynamic";

export default async function FormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = await params;

  if (!db || !adminAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-md border border-red-200 bg-red-50 p-6 rounded-2xl text-red-700">
          <h2 className="text-xl font-bold">Firebase Configuration Missing</h2>
          <p className="text-sm mt-1">Please define your Firebase keys in environment variables.</p>
        </div>
      </div>
    );
  }

  // Get session cookie
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) {
    redirect("/login");
  }

  let decodedClaims;
  try {
    decodedClaims = await adminAuth.verifySessionCookie(session, true);
  } catch (e) {
    redirect("/login");
  }

  const userId = decodedClaims.uid;

  // Retrieve form details from Firestore
  const formRef = db.collection("forms").doc(formId);
  const formDoc = await formRef.get();

  if (!formDoc.exists) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-md border border-slate-200 bg-white p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-slate-800">Formulir Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500 mt-1">Halaman yang Anda cari tidak ada atau telah dihapus.</p>
        </div>
      </div>
    );
  }

  const formData = formDoc.data();
  if (formData?.userId !== userId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-md border border-amber-200 bg-amber-50 p-6 rounded-2xl text-amber-800">
          <h2 className="text-xl font-bold">Akses Ditolak</h2>
          <p className="text-sm mt-1">Anda tidak memiliki izin untuk mengedit formulir ini.</p>
        </div>
      </div>
    );
  }

  // Map to Form type interface
  const initialForm: Form = {
    id: formDoc.id,
    userId: formData.userId,
    name: formData.name,
    description: formData.description || "",
    slug: formData.slug || formDoc.id,
    published: !!formData.published,
    fields: (formData.fields as FormField[]) || [],
    visits: formData.visits || 0,
    submissionsCount: formData.submissionsCount || 0,
    createdAt: formData.createdAt ? formData.createdAt.toDate().toISOString() : null,
    updatedAt: formData.updatedAt ? formData.updatedAt.toDate().toISOString() : null,
  };

  return <FormBuilder initialForm={initialForm} />;
}
