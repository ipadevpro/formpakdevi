# Rencana Desain Peningkatan UI/UX AOP Form Builder

**Tanggal:** 23 Februari 2025  
**Status:** Disetujui  

Rencana ini berfokus pada pemolesan visual, stabilitas teknis, dan interaktivitas komponen form builder serta tampilan form publik agar terasa lebih premium, modern, dan intuitif.

## 1. Fondasi Teknis & Stabilitas Sesi

Sebelum pemolesan visual dilakukan, beberapa kendala teknis terkait Next.js App Router harus diselesaikan:
* **Client Directives:** Menambahkan `"use client"` di baris teratas file yang menggunakan React state/hooks atau client APIs:
  * `app/(dashboard)/layout.tsx`
  * `app/(auth)/login/page.tsx`
  * `components/provider/auth-provider.tsx`
* **Redirect Imports:** Menambahkan `import { redirect } from "next/navigation";` di Server Components yang menggunakan fungsi redirect:
  * `app/(dashboard)/dashboard/page.tsx`
  * `app/(dashboard)/forms/[formId]/page.tsx`
  * `app/(dashboard)/forms/[formId]/stats/page.tsx`
  * `app/(dashboard)/forms/[formId]/subs/page.tsx`

## 2. Peningkatan Visual Dashboard

Menyegarkan halaman `/dashboard` agar manajemen form terasa lebih profesional:
* **Form Card Hover & Shadow:** Menambahkan efek translasi vertikal (`hover:-translate-y-0.5 transition-all duration-300`) dan bayangan yang lebih tebal (`hover:shadow-lg`).
* **Visual Status Badge:** 
  * `Published`: Hijau emerald segar (`bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800`).
  * `Draft`: Abu-abu netral.
* **Statistik Mikro:** Menambahkan ikon mikro di sebelah indikator statistik (ikon `Eye` untuk Kunjungan, ikon `Inbox` atau `MessageSquare` untuk Submissions).

## 3. Peningkatan Workspace Builder

Meningkatkan interaksi pada halaman edit form:
* **Canvas Editor Kosong:** Menyediakan visual placeholder dengan border dashed tebal tapi lembut, ikon representatif, dan tipografi yang memandu user untuk mulai menarik/klik elemen di sidebar.
* **Active Field Accent:** Menambahkan aksen tepi kiri tebal (`border-l-4 border-l-primary`) pada elemen yang sedang dipilih di canvas, ditambah dengan bayangan lembut dan latar belakang gradasi halus untuk menonjolkan fokus.
* **Interactive Sidebar Elements:** Transisi hover pada tombol elemen di sidebar (`hover:scale-102 hover:border-primary/50 duration-200`) untuk respon taktil yang menyenangkan.

## 4. Redesain Komponen Form Publik

Mengubah tampilan form responden agar ramah pengguna (terutama perangkat seluler) dan modern:
* **Drag & Drop File Upload Zone:**
  * Menyembunyikan input file standar bawaan browser.
  * Menampilkan area upload dropzone dengan border dashed, ikon `UploadCloud`, dan instruksi unggah yang jelas.
  * Menampilkan pratinjau file yang dipilih (nama file, ukuran file, ikon file sukses, dan tombol hapus instan).
* **Interaktivitas Rating Bintang:**
  * Mendukung hover state dinamis: bintang-bintang di bawah kursor menyala redup (`text-amber-300`) sebelum diklik.
  * Menambahkan mikro-animasi (scale up singkat) saat bintang diklik.
  * Memperbesar ukuran bintang agar ramah sentuhan jari (mobile-friendly).
* **Aksen Desain Form Card:** Menambahkan garis gradasi tipis di bagian atas kartu form publik untuk tampilan yang lebih modern.
