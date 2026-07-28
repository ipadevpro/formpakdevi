import { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase-admin";
import { PublicForm } from "@/components/builder/public-form";
import { Form, FormField } from "@/lib/types";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

interface PublicFormPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PublicFormPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!db) return { title: "AOP Form Builder" };

  try {
    const slugRef = db.collection("slugs").doc(slug);
    const slugDoc = await slugRef.get();
    if (!slugDoc.exists) return { title: "Form Not Found" };

    const { formId } = slugDoc.data() || {};
    if (!formId) return { title: "Form Not Found" };

    const formDoc = await db.collection("forms").doc(formId).get();
    if (!formDoc.exists) return { title: "Form Not Found" };

    const formData = formDoc.data();
    return {
      title: formData?.name || "Formulir Publik",
      description: formData?.description || "Silakan isi formulir ini.",
    };
  } catch {
    return { title: "AOP Form Builder" };
  }
}

export default async function PublicFormPage({ params }: PublicFormPageProps) {
  const { slug } = await params;

  if (!db) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="max-w-md border border-red-200 bg-red-50 p-6 rounded-2xl text-red-700">
          <h2 className="text-xl font-bold">Firebase Configuration Missing</h2>
          <p className="text-sm mt-1">Please configure your Firebase variables.</p>
        </div>
      </div>
    );
  }

  // 1. Look up formId by slug
  const slugRef = db.collection("slugs").doc(slug);
  const slugDoc = await slugRef.get();

  if (!slugDoc.exists) {
    notFound();
  }

  const { formId } = slugDoc.data() || {};
  if (!formId) {
    notFound();
  }

  // 2. Load form details
  const formRef = db.collection("forms").doc(formId);
  const formDoc = await formRef.get();

  if (!formDoc.exists) {
    notFound();
  }

  const formData = formDoc.data() || {};

  // If form is not published, show draft screen
  if (!formData.published) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
        <div className="max-w-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Formulir Tidak Aktif</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Formulir ini saat ini sedang dalam status draf dan belum dipublikasikan oleh pemiliknya.
          </p>
        </div>
      </div>
    );
  }

  // 3. Increment visit counts inside transaction/atomic update
  try {
    await formRef.update({
      visits: FieldValue.increment(1),
    });
  } catch (error) {
    console.error("Failed to increment visit count:", error);
  }

  const form: Form = {
    id: formDoc.id,
    userId: formData.userId,
    name: formData.name,
    description: formData.description || "",
    slug: formData.slug || formDoc.id,
    published: !!formData.published,
    fields: (formData.fields as FormField[]) || [],
    visits: (formData.visits || 0) + 1, // include current visit
    submissionsCount: formData.submissionsCount || 0,
    createdAt: formData.createdAt ? formData.createdAt.toDate().toISOString() : null,
    updatedAt: formData.updatedAt ? formData.updatedAt.toDate().toISOString() : null,
  };

  return <PublicForm form={form} />;
}
