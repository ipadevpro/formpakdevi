# Rencana Desain: AOP Form Builder Drag n Drop dengan Firebase & Shadcn UI

Rencana ini mendokumentasikan hasil sesi brainstorming untuk pembuatan aplikasi Web AOP Form Builder.

## 1. Arsitektur & Teknologi Utama
Aplikasi ini dibangun menggunakan arsitektur **Next.js Full-Stack App (App Router)** yang terintegrasi dengan Firebase dan Shadcn UI:

- **Frontend & Backend (Monolith):** Next.js 14/15 App Router.
- **Styling & UI Components:** Tailwind CSS & Shadcn UI (Radix UI) secara menyeluruh.
- **Database:** Firebase Firestore (diakses server-side via `firebase-admin`).
- **Autentikasi:** Google Sign-in (Firebase Auth Client SDK) dengan manajemen sesi server-side menggunakan **Firebase Session Cookies** (HTTP-Only, Secure).
- **Drag-and-Drop Engine:** `@dnd-kit/core` & `@dnd-kit/sortable`.
- **Analytics Charts:** Shadcn UI Chart / Recharts.
- **Table Spreadsheet:** TanStack Table (React Table) dengan fitur filter, pagination, copy-to-clipboard, dan export ke CSV.

---

## 2. Struktur Direktori Proyek

```text
/Users/users/Projects/cursor/formpakdeviv2/
├── app/
│   ├── (auth)/                  # Auth layouts & pages
│   │   └── login/               # Sign in dengan Google
│   ├── (dashboard)/             # Protected dashboard area
│   │   ├── layout.tsx           # Sidebar, navbar, user profile
│   │   ├── dashboard/           # Daftar form & ringkasan statistik
│   │   └── forms/
│   │       └── [formId]/        # Edit / Builder screen
│   │           ├── stats/       # Statistik & chart analitik
│   │           └── subs/        # Spreadsheet Submissions view
│   ├── s/
│   │   └── [slug]/              # Route publik untuk mengisi form (menggunakan slug kustom)
│   ├── api/
│   │   ├── auth/
│   │   │   └── session/         # Endpoint set session cookie
│   │   └── forms/
│   │       └── [formId]/submit/ # Endpoint API publik untuk menerima submission
│   ├── layout.tsx
│   └── page.tsx                 # Landing Page
├── components/
│   ├── ui/                      # Shadcn-ui components
│   ├── builder/                 # Komponen drag-and-drop form builder
│   ├── dashboard/               # Charts analitik, tabel submission (TanStack Table)
│   └── provider/                # Auth context & Toast providers
├── lib/
│   ├── firebase-admin.ts        # Inisialisasi Firebase Admin SDK (Secure server-side)
│   ├── firebase-client.ts       # Inisialisasi Firebase Client (Google sign-in)
│   └── types.ts                 # Type definitions (Form, Submission, Stats)
└── package.json
```

---

## 3. Skema Database (Firestore Collections)

### `users` Collection
- **Doc ID:** `userId` (UID dari Firebase Auth)
```json
{
  "email": "user@example.com",
  "displayName": "Jenderal Pakdevi",
  "photoURL": "https://...",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `forms` Collection
- **Doc ID:** `formId` (Random ID generated)
```json
{
  "userId": "owner_user_id",
  "name": "Formulir Pendaftaran Siswa",
  "description": "Formulir pendaftaran untuk AOP Class",
  "slug": "pendaftaran-aop-2024", // Mulai dari Short ID otomatis, bisa dikustomisasi
  "published": true,
  "fields": [
    {
      "id": "field_17293021",
      "type": "text", // text, textarea, email, number, select, radio, checkbox, date, file, etc.
      "label": "Nama Lengkap",
      "placeholder": "Masukkan nama lengkap...",
      "required": true,
      "validation": { "min": 2, "max": 100 },
      "options": []
    }
  ],
  "visits": 125,
  "submissionsCount": 42,
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

### `submissions` Collection
- **Doc ID:** `submissionId` (Random ID generated)
```json
{
  "formId": "formId_123",
  "answers": {
    "field_17293021": "Budi Santoso",
    "field_17293022": "budi@mail.com"
  },
  "submittedAt": "timestamp",
  "deviceInfo": "Mobile / Chrome"
}
```

### `slugs` Collection (Lookup Keunikan Slug)
- **Doc ID:** `slug_name` (e.g., `pendaftaran-aop-2024`)
```json
{
  "formId": "formId_123",
  "userId": "owner_user_id"
}
```

---

## 4. Jenis Input Form Lengkap yang Didukung
1. **Teks:** Single Line Text, Paragraph Text (Textarea), Email, Number, Phone Number.
2. **Pilihan:** Select Dropdown, Radio Group, Checkbox Group, Single Checkbox (Switch).
3. **Lanjutan:** Date Picker, File Upload (Firebase Storage integration), Rating (Star/number selector).

---

## 5. Fitur Kunci Aplikasi
- **Drag-and-Drop Visual Editor:** Sidebar komponen di kiri, canvas editor di tengah dengan sortable fields, dan properties editor di kanan.
- **Sistem Slug Kustom:** Form diakses di `form.pakdevi.com/s/[slug]`. Pengguna dapat mengkustomisasi slug unik mereka.
- **Dashboard Analitik:** Menyajikan total kunjungan, total submission, conversion rate, serta chart line/bar performa harian.
- **Tabel Spreadsheet Interaktif:** Menampilkan data submission dengan performa tinggi. Mendukung pencarian, filter, copy data secara langsung ke clipboard (`Ctrl+C`), dan ekspor data ke Excel/CSV.
