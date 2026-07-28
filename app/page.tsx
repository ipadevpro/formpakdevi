import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FileSpreadsheet, LayoutDashboard, ArrowRight, BarChart3, Users, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 font-sans">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-slate-850 dark:text-slate-200" />
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100">
            AOP Form Builder
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="ghost" size="sm">Masuk</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="sm" className="gap-1.5">
              Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center max-w-4xl mx-auto gap-6">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight max-w-2xl">
          Buat Formulir Kustom dengan Drag n Drop
        </h1>

        <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl">
          Desain formulir Anda sendiri secara visual, kustomisasi slug link unik Anda (misal: <code>form.pakdevi.com/form-anda</code>), 
          pantau tren kunjungan harian, dan kelola semua respon masuk dalam spreadsheet interaktif.
        </p>

        <div className="flex items-center gap-3 mt-2">
          <Link href="/dashboard">
            <Button size="default" className="font-semibold">
              Mulai Bangun Formulir
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="default" className="border-slate-250 dark:border-slate-800">
              Masuk Google
            </Button>
          </Link>
        </div>

        {/* Features Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 w-full text-left border-t border-slate-100 dark:border-slate-800 pt-12">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Sparkles className="h-4 w-4 text-slate-500" />
              <h3 className="font-bold text-sm">Drag n Drop Workspace</h3>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Seret dan lepaskan berbagai tipe field mulai dari teks, angka, kalender, rating bintang, hingga unggah file.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <BarChart3 className="h-4 w-4 text-slate-500" />
              <h3 className="font-bold text-sm">Analitik & Statistik</h3>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Pantau total kunjungan (views), jumlah respon masuk, tingkat konversi, tren pengisian harian, dan browser perangkat.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-900 dark:text-slate-100">
              <Users className="h-4 w-4 text-slate-500" />
              <h3 className="font-bold text-sm">Manajemen Spreadsheet</h3>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
              Lihat jawaban dalam tabel data interaktif. Salin data sel instan dengan satu klik, cari respon, dan unduh ke format Excel/CSV.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 shrink-0">
        © {new Date().getFullYear()} AOP Form Builder. Powered by Pakdevi Domain & Firebase
      </footer>
    </div>
  );
}
