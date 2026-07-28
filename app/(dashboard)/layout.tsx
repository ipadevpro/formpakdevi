"use client";

import React from "react";
import { AuthProvider, useAuth } from "@/components/provider/auth-provider";
import { Button } from "@/components/ui/button";
import { FileSpreadsheet, LogOut, LayoutDashboard, FormInput } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();

  // If loading user state, show a clean spinner
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="text-sm text-slate-500 font-medium">Memuat Sesi...</span>
        </div>
      </div>
    );
  }

  // Prevent layout rendering if not authenticated (handled by middleware but keeps code safe)
  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      {/* Sidebar Panel */}
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0 hidden md:flex">
        <div className="h-16 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center gap-2 shrink-0">
          <FileSpreadsheet className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg tracking-tight">AOP Builder</span>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          <Link href="/dashboard">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </nav>

        {/* User profile & Sign out */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {user.photoURL ? (
              <img src={user.photoURL} alt={user.displayName || "User"} className="h-9 w-9 rounded-full" />
            ) : (
              <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm">
                {user.email?.[0].toUpperCase()}
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold truncate text-slate-900 dark:text-slate-100">
                {user.displayName || "Pengguna AOP"}
              </span>
              <span className="text-[10px] text-slate-500 truncate">{user.email}</span>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="w-full gap-1.5 justify-center">
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Work Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between shrink-0 md:justify-end">
          <div className="flex items-center gap-2 md:hidden">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            <span className="font-bold tracking-tight text-sm">AOP Builder</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 md:hidden">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              Link: form.pakdevi.com
            </span>
          </div>
        </header>

        {/* Page Inner Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
