import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db, adminAuth } from "@/lib/firebase-admin";
import { CreateFormButton } from "@/components/dashboard/create-form-btn";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit3, BarChart3, ListCollapse, ExternalLink, Globe, Eye, MessageSquare } from "lucide-react";
import Link from "next/link";

interface DashboardForm {
  id: string;
  name: string;
  description: string;
  slug: string;
  published: boolean;
  visits: number;
  submissionsCount: number;
  createdAt: Date;
}

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  if (!db || !adminAuth) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center border border-red-200 bg-red-50 rounded-2xl text-red-700">
        <h2 className="text-xl font-bold">Firebase Configuration Missing</h2>
        <p className="text-sm mt-1">Please define your Firebase keys in environment variables.</p>
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

  // Retrieve user's forms
  const formsSnapshot = await db
    .collection("forms")
    .where("userId", "==", userId)
    .get();

  const formsList: DashboardForm[] = formsSnapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      description: data.description || "",
      slug: data.slug || doc.id,
      published: !!data.published,
      visits: data.visits || 0,
      submissionsCount: data.submissionsCount || 0,
      createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
    };
  });

  // Sort by createdAt desc in memory to avoid index creation requirements in Firestore
  formsList.sort((a: DashboardForm, b: DashboardForm) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className="flex flex-col gap-8">
      {/* Upper header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
            Formulir Saya
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Kelola, edit, dan pantau seluruh formulir Anda.
          </p>
        </div>
        <CreateFormButton />
      </div>

      {formsList.length === 0 ? (
        // Empty State layout
        <div className="flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl py-16 px-4 text-center">
          <div className="h-12 w-12 bg-slate-100 dark:bg-slate-950 rounded-full flex items-center justify-center text-slate-400 mb-4">
            <Globe className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Belum Ada Formulir</h3>
          <p className="text-sm text-slate-500 max-w-sm mt-1">
            Anda belum membuat formulir apa pun. Klik tombol "Form Baru" di atas untuk mulai.
          </p>
        </div>
      ) : (
        // Forms Card Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formsList.map((form: DashboardForm) => (
            <Card
              key={form.id}
              className="flex flex-col border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 rounded-2xl overflow-hidden"
            >
              <CardHeader className="pb-3 flex flex-col gap-1.5 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  {form.published ? (
                    <Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100/50 shadow-none font-semibold">
                      Published
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-200/50 shadow-none font-semibold">
                      Draft
                    </Badge>
                  )}
                  <span className="text-[10px] text-slate-400 font-mono">
                    {form.createdAt.toLocaleDateString("id-ID")}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold truncate text-slate-800 dark:text-slate-100" title={form.name}>
                  {form.name}
                </CardTitle>
                <CardDescription className="text-xs truncate h-4" title={form.description}>
                  {form.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-4 pt-0 flex-1">
                {/* Stats indicators */}
                <div className="grid grid-cols-2 gap-4 bg-slate-50/50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Eye className="h-3 w-3 text-slate-400" />
                      Kunjungan
                    </span>
                    <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 leading-none">
                      {form.visits}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <MessageSquare className="h-3 w-3 text-slate-400" />
                      Respon
                    </span>
                    <span className="text-lg font-extrabold text-slate-800 dark:text-slate-100 leading-none">
                      {form.submissionsCount}
                    </span>
                  </div>
                </div>

                {/* Custom Slug Link Preview */}
                <div className="mt-4 flex items-center justify-between text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-slate-400 truncate flex items-center gap-1">
                    <Globe className="h-3 w-3 shrink-0" />
                    /{form.slug}
                  </span>
                  {form.published && (
                    <a
                      href={`/${form.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline flex items-center gap-0.5"
                    >
                      Buka <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t border-slate-100 dark:border-slate-800 pt-3 pb-3 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50 rounded-b-xl gap-2 shrink-0">
                <Link href={`/forms/${form.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full gap-1">
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/forms/${form.id}/stats`}>
                  <Button variant="ghost" size="icon" className="h-9 w-9" title="Statistik">
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={`/forms/${form.id}/subs`}>
                  <Button variant="ghost" size="icon" className="h-9 w-9" title="Submissions">
                    <ListCollapse className="h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
