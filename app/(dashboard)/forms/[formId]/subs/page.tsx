import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db, adminAuth } from "@/lib/firebase-admin";
import { SubmissionsTable } from "@/components/dashboard/submissions-table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit3, BarChart3 } from "lucide-react";
import Link from "next/link";
import { FormField, Submission } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function SubmissionsPage({
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
          <p className="text-sm mt-1">Please configure your Firebase variables.</p>
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

  // Retrieve form details
  const formRef = db.collection("forms").doc(formId);
  const formDoc = await formRef.get();

  if (!formDoc.exists) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-md border border-slate-200 bg-white p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-slate-800">Formulir Tidak Ditemukan</h2>
        </div>
      </div>
    );
  }

  const formData = formDoc.data() || {};
  if (formData.userId !== userId) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-md border border-amber-200 bg-amber-50 p-6 rounded-2xl text-amber-700">
          <h2 className="text-xl font-bold">Akses Ditolak</h2>
        </div>
      </div>
    );
  }

  // Fetch submissions list
  const submissionsSnapshot = await db
    .collection("submissions")
    .where("formId", "==", formId)
    .get();

  const submissionsList: Submission[] = submissionsSnapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      id: doc.id,
      formId: data.formId,
      answers: data.answers || {},
      submittedAt: data.submittedAt ? data.submittedAt.toDate().toISOString() : new Date().toISOString(),
      deviceInfo: data.deviceInfo,
    };
  });

  // Sort submissions by submittedAt desc in-memory
  submissionsList.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const fields = (formData.fields as FormField[]) || [];

  return (
    <div className="flex flex-col gap-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-700">
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{formData.name}</h1>
            <p className="text-sm text-slate-500">Lihat dan ekspor respon formulir Anda.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/forms/${formId}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Edit3 className="h-3.5 w-3.5" />
              Edit Form
            </Button>
          </Link>
          <Link href={`/forms/${formId}/stats`}>
            <Button variant="outline" size="sm" className="gap-1">
              <BarChart3 className="h-3.5 w-3.5" />
              Statistik
            </Button>
          </Link>
        </div>
      </div>

      {/* Mapped spreadsheet table */}
      <SubmissionsTable fields={fields} submissions={submissionsList} />
    </div>
  );
}
