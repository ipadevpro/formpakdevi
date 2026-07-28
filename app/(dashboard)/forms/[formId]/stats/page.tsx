import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { db, adminAuth } from "@/lib/firebase-admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { ChevronLeft, MessageSquare, Edit3 } from "lucide-react";
import Link from "next/link";
import { format, subDays } from "date-fns";

export const dynamic = "force-dynamic";

interface SubmissionStat {
  id: string;
  submittedAt: Date;
  deviceInfo: string;
}

export default async function StatsPage({
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

  // Fetch all submissions for stats compilation
  const submissionsSnapshot = await db
    .collection("submissions")
    .where("formId", "==", formId)
    .get();

  const submissions: SubmissionStat[] = submissionsSnapshot.docs.map((doc: any) => {
    const data = doc.data();
    return {
      id: doc.id,
      submittedAt: data.submittedAt ? data.submittedAt.toDate() : new Date(),
      deviceInfo: data.deviceInfo || "Desktop",
    };
  });

  // Calculate Conversion Rate
  const totalVisits = formData.visits || 0;
  const totalSubmissions = submissions.length;
  const conversionRate = totalVisits > 0 ? ((totalSubmissions / totalVisits) * 100).toFixed(1) : "0.0";

  // Build trend data points for the last 30 days
  const dailyCounts: Record<string, number> = {};
  // Seed last 30 days with 0 to ensure continuous charts
  for (let i = 29; i >= 0; i--) {
    const dateStr = format(subDays(new Date(), i), "dd MMM");
    dailyCounts[dateStr] = 0;
  }

  submissions.forEach((sub: SubmissionStat) => {
    const subDateStr = format(sub.submittedAt, "dd MMM");
    if (dailyCounts[subDateStr] !== undefined) {
      dailyCounts[subDateStr] += 1;
    }
  });

  const trendData = Object.entries(dailyCounts).map(([date, count]) => ({
    date,
    count,
  }));

  // Build device stats
  let desktopCount = 0;
  let mobileCount = 0;
  let tabletCount = 0;

  submissions.forEach((sub: SubmissionStat) => {
    if (sub.deviceInfo === "Mobile") mobileCount++;
    else if (sub.deviceInfo === "Tablet") tabletCount++;
    else desktopCount++;
  });

  const deviceData = [
    { name: "Desktop", value: desktopCount },
    { name: "Mobile", value: mobileCount },
    { name: "Tablet", value: tabletCount },
  ];

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
            <p className="text-sm text-slate-500">Statistik dan performa respon formulir.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/forms/${formId}`}>
            <Button variant="outline" size="sm" className="gap-1">
              <Edit3 className="h-3.5 w-3.5" />
              Edit Form
            </Button>
          </Link>
          <Link href={`/forms/${formId}/subs`}>
            <Button variant="outline" size="sm" className="gap-1">
              <MessageSquare className="h-3.5 w-3.5" />
              Submissions
            </Button>
          </Link>
        </div>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="pb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Kunjungan</span>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-50">{totalVisits}</span>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="pb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Total Respon</span>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-50">{totalSubmissions}</span>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <CardHeader className="pb-2">
            <span className="text-xs text-slate-400 font-semibold uppercase">Tingkat Konversi</span>
          </CardHeader>
          <CardContent>
            <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-50">{conversionRate}%</span>
          </CardContent>
        </Card>
      </div>

      {/* Chart components */}
      <AnalyticsCharts trendData={trendData} deviceData={deviceData} />
    </div>
  );
}
