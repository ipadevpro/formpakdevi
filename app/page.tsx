"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { FileSpreadsheet, Sparkles, LayoutDashboard, ArrowRight, ShieldCheck, BarChart3, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      {/* Navbar */}
      <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-slate-100">
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
      <main className="flex-1 flex flex-col items-center justify-center py-20 px-6 text-center max-w-4xl mx-auto gap-8">
        <div className="inline-flex items-center gap-1.5 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 text-xs font-semibold text-blue-700 dark:text-blue-300">
          <Sparkles className="h-3.5 w-3.5" />
          Mudah, Cepat, dan Interaktif
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 leading-tight">
          Buat Formulir Kustom dengan <span className="text-primary bg-clip-text">Drag n Drop</span>
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
          Desain formulir Anda sendiri secara visual, kustomisasi slug link unik Anda (misal: <code>form.pakdevi.com/s/form-anda</code>), 
          pantau tren kunjungan harian, dan kelola semua respon masuk dalam tampilan spreadsheet yang interaktif.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link href="/dashboard">
            <Button size="lg" className="h-12 px-8 text-base gap-2 font-bold shadow-md">
              <LayoutDashboard className="h-5 w-5" />
              Mulai Bangun Formulir
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="h-12 px-8 text-base border-slate-300 hover:bg-slate-100 dark:border-slate-800">
              Masuk Akun Google
            </Button>
          </Link>
        </div>

        {/* Features Info grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 w-full text-left">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="h-10 w-10 bg-blue-50 dark:bg-blue-950/55 rounded-xl flex items-center justify-center text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Drag n Drop Workspace</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Seret dan lepaskan berbagai tipe field mulai dari teks, angka, kalender, rating bintang, hingga unggah file.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="h-10 w-10 bg-emerald-50 dark:bg-emerald-950/55 rounded-xl flex items-center justify-center text-emerald-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Analitik & Statistik</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pantau total kunjungan (views), jumlah respon masuk, tingkat konversi, tren pengisian harian, dan asal browser perangkat.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-3">
            <div className="h-10 w-10 bg-indigo-50 dark:bg-indigo-950/55 rounded-xl flex items-center justify-center text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-slate-100">Manajemen Spreadsheet</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Lihat jawaban dalam tabel data interaktif. Salin data sel instan dengan satu klik, cari respon, dan unduh ke format Excel/CSV.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 shrink-0">
        © {new Date().getFullYear()} AOP Form Builder. Powered by Pakdevi Domain & Firebase
      </footer>
    </div>
  );
}
