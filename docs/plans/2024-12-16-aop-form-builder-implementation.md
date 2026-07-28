# AOP Form Builder Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete, modern drag-and-drop form builder with a dashboard, statistics, custom slug routing, and a copyable spreadsheet-like submission viewer.

**Architecture:** Next.js App Router (Fullstack). Firestore is accessed exclusively on the server using `firebase-admin`. Auth utilizes Google Sign-In on the client and is secured on the server via Session Cookies.

**Tech Stack:** Next.js, Tailwind CSS, Shadcn UI, `@dnd-kit/core`, `@tanstack/react-table`, `recharts`, `firebase` (client client-auth), `firebase-admin` (server-side db & auth), Bun runtime.

---

## Tasks Overview

- [ ] Task 1: Project Initialization & Dependency Installation
- [ ] Task 2: Firebase Connection Setup (Client & Admin SDK)
- [ ] Task 3: Authentication & Protected Middleware (Session Cookies)
- [ ] Task 4: Drag-and-Drop Form Builder Workspace (dnd-kit + Builder Context)
- [ ] Task 5: Form Fields Custom Properties Panel
- [ ] Task 6: Public Form Compiler (`/s/[slug]`) & API Submission Route
- [ ] Task 7: Dashboard Forms List & Analytics Charts
- [ ] Task 8: Spreadsheet-like Submissions Page (TanStack Table + Copy/Export)

---

## Detailed Task Steps

### Task 1: Project Initialization & Dependency Installation

**Files:**
- Create: `package.json`
- Create: `tailwind.config.js`
- Create: `tsconfig.json`

**Step 1: Run Next.js boilerplate generation**
Run: `bun create next-app . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"`
Expected: Clean Next.js project directory structure.

**Step 2: Install dependencies**
Run: `bun add @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities @tanstack/react-table recharts lucide-react firebase firebase-admin next-themes clsx tailwind-merge class-variance-authority canvas-confetti @types/canvas-confetti`
Expected: Installation completes successfully without peer dependency conflicts.

**Step 3: Setup Shadcn UI**
Run: `bun x shadcn-ui@latest init` (Select Default style, Neutral slate, CSS variables: Yes)
Expected: `components.json` generated, `app/globals.css` updated.

**Step 4: Install required Shadcn components**
Run: `bun x shadcn-ui@latest add button card input textarea select checkbox switch dialog tabs badge separator toast calendar popover table`
Expected: UI components created inside `components/ui/`.

**Step 5: Verification & Commit**
Verify local dev server builds successfully: `bun run build`
Commit:
```bash
git add .
git commit -m "chore: initialize next.js with shadcn ui and project dependencies"
```

---

### Task 2: Firebase Connection Setup (Client & Admin SDK)

**Files:**
- Create: `lib/firebase-client.ts`
- Create: `lib/firebase-admin.ts`
- Create: `.env.local`

**Step 1: Write Environment Variable template**
Add to `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

**Step 2: Create Client SDK Initializer**
Write `lib/firebase-client.ts` for Client-side authentication:
```typescript
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
```

**Step 3: Create Server Admin SDK Initializer**
Write `lib/firebase-admin.ts` for secure Firestore access:
```typescript
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export const db = admin.firestore();
export const adminAuth = admin.auth();
```

**Step 4: Commit**
Commit:
```bash
git add lib/firebase-client.ts lib/firebase-admin.ts
git commit -m "feat: setup firebase client and admin sdk connection modules"
```

---

### Task 3: Authentication & Protected Middleware (Session Cookies)

**Files:**
- Create: `app/api/auth/session/route.ts`
- Create: `middleware.ts`
- Create: `app/(auth)/login/page.tsx`
- Create: `components/provider/auth-provider.tsx`

**Step 1: Write Auth Provider**
Write `components/provider/auth-provider.tsx` using Firebase Auth state listener to automatically keep UI updated and coordinate token updates.

**Step 2: Write API Session Cookie Handler**
Write `app/api/auth/session/route.ts`:
- Accepts POST with ID Token.
- Verifies ID Token using `adminAuth.createSessionCookie()`.
- Sets session cookie in client browser (HTTP-Only, Secure).
- Accepts DELETE to clear the cookie.

**Step 3: Write Next.js middleware.ts**
Interceptors for `/dashboard`, `/forms/*`:
- Reads session cookie.
- If missing, redirect to `/login`.

**Step 4: Create Login Page with Google Button**
Create a beautiful page in `app/(auth)/login/page.tsx` with a Google Login button that signs in, fetches the ID token, calls `/api/auth/session`, and redirects to `/dashboard`.

**Step 5: Verification & Commit**
Verify mock tests or build.
Commit:
```bash
git add app/api/auth/session/route.ts middleware.ts app/(auth)/login/page.tsx components/provider/auth-provider.tsx
git commit -m "feat: implement google auth session cookie flow and dashboard middleware"
```

---

### Task 4: Drag-and-Drop Form Builder Workspace

**Files:**
- Create: `components/builder/builder-context.tsx`
- Create: `components/builder/designer-canvas.tsx`
- Create: `components/builder/elements-sidebar.tsx`
- Create: `app/(dashboard)/forms/[formId]/page.tsx`

**Step 1: Write Form Builder Context**
Define fields layout array, active selection, functions to `addField`, `removeField`, `updateField`, and `reorderFields` using standard `@dnd-kit` sortable array methods.

**Step 2: Write Elements Sidebar**
List drag sources: Text, Textarea, Email, Number, Select, Checkbox, Radio, Date, File, Rating. Each with drag properties.

**Step 3: Write Designer Canvas (Drop Zone)**
Accept dragged items, append to active form list, render sortable blocks. When clicked, mark field as active.

**Step 4: Create Form Editing Page**
Load form details from Firestore Admin SDK. Mount Context, Sidebar, and Canvas. Include a "Save Form" Server Action button that serializes schema array and updates the `forms` document in Firestore.

**Step 5: Commit**
Commit:
```bash
git add components/builder/ app/(dashboard)/forms/[formId]/page.tsx
git commit -m "feat: build drag and drop canvas editor with context state"
```

---

### Task 5: Form Fields Custom Properties Panel

**Files:**
- Create: `components/builder/properties-panel.tsx`
- Modify: `components/builder/designer-canvas.tsx`

**Step 1: Write Properties Panel Component**
If a field is active, display inputs to edit:
- Label text
- Helper/Description text
- Placeholder text
- Is Required (boolean switch)
- Specific Options list (add/remove strings for select, checkbox, radio)
- Max file size / Allowed extensions (for file upload field)

**Step 2: Integrate Properties Panel into Builder View**
Display it on the right sidebar when a field is selected.

**Step 3: Verification & Commit**
Commit:
```bash
git add components/builder/properties-panel.tsx
git commit -m "feat: add field custom properties panel in form builder sidebar"
```

---

### Task 6: Public Form Compiler & API Submission Route

**Files:**
- Create: `app/s/[slug]/page.tsx`
- Create: `app/api/forms/[formId]/submit/route.ts`

**Step 1: Create Public Page Resolver**
In `app/s/[slug]/page.tsx`:
- Look up the `slugs` collection. Find corresponding `formId`.
- Fetch form document. If published is false, show "Form not active".
- Increment visit count in Firestore (`visits: admin.firestore.FieldValue.increment(1)`).
- Render fields dynamically with Shadcn controls wrapped in standard React Hook Form.

**Step 2: Write Public Submission Route**
In `app/api/forms/[formId]/submit/route.ts`:
- Accepts POST submission body.
- Performs schema checks (required fields validation, regex email check, min/max length).
- Saves submission in `submissions` Firestore collection.
- Increments `submissionsCount` in form document.

**Step 3: Add Success Confetti**
After successful submission, show a clean thank-you screen and launch `canvas-confetti`.

**Step 4: Commit**
Commit:
```bash
git add app/s/[slug]/page.tsx app/api/forms/[formId]/submit/route.ts
git commit -m "feat: implement public form renderer, submission backend validation, and confetti feedback"
```

---

### Task 7: Dashboard Forms List & Analytics Charts

**Files:**
- Create: `app/(dashboard)/dashboard/page.tsx`
- Create: `app/(dashboard)/forms/[formId]/stats/page.tsx`
- Create: `components/dashboard/analytics-charts.tsx`

**Step 1: Build Forms Dashboard Grid**
List all forms owned by current user. Display status badge (Published/Draft), total submissions, custom slug preview link, and buttons to edit, view analytics, and view submissions. Include a Dialog to create new form (generates random slug).

**Step 2: Build Stats Overview Layout**
Page for `/stats` showing Cards for Total Visits, Submissions, and Conversion Rate.

**Step 3: Render Analytics Charts**
Using Shadcn UI Chart / Recharts, query submissions over the last 30 days and map submissions counts per day. Render a beautiful LineChart or BarChart.

**Step 4: Commit**
Commit:
```bash
git add app/(dashboard)/dashboard/page.tsx app/(dashboard)/forms/[formId]/stats/page.tsx components/dashboard/
git commit -m "feat: construct main dashboard list, statistics panels, and recharts analytics"
```

---

### Task 8: Spreadsheet-like Submissions Page

**Files:**
- Create: `app/(dashboard)/forms/[formId]/subs/page.tsx`
- Create: `components/dashboard/submissions-table.tsx`

**Step 1: Initialize TanStack Table Component**
In `components/dashboard/submissions-table.tsx`:
- Receive form fields schema and submissions list.
- Construct headers from active fields (dynamic columns).
- Populate table rows with actual answers mapped to field IDs.
- Add Search bar, page controller.

**Step 2: Implement Spreadsheet Utility Actions**
- **Copy Action:** Clicking a copy icon next to cell or row copies plain text to clipboard.
- **Export to CSV:** Client-side CSV generator converting the grid data to CSV format and downloading it instantly.

**Step 3: Verification & Commit**
Run final builds and test all pages.
Commit:
```bash
git add app/(dashboard)/forms/[formId]/subs/page.tsx components/dashboard/submissions-table.tsx
git commit -m "feat: build spreadsheet submissions table with dynamic columns, search, copy, and csv download"
```
