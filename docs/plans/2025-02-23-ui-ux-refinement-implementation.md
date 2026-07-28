# UI/UX Refinement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Refine the UI/UX across AOP Form Builder, including fixing missing "use client" and redirect imports, adding card hover animations and stat icons to the dashboard, enhancing workspace canvas empty states, active fields, and redesigning the public form components (drag-and-drop file upload zone and star ratings).

**Architecture:** Use CSS transitions, Tailwind utilities, and React states to implement premium hover scales, visual highlights, and interactive upload previews without changing the underlying Firebase or business logic.

**Tech Stack:** Next.js, Tailwind CSS, Lucide React icons, and React state.

---

### Task 1: Stabilitas Sesi & Client Directives

**Files:**
- Modify: `app/(dashboard)/layout.tsx` (add `"use client"`)
- Modify: `app/(auth)/login/page.tsx` (add `"use client"`)
- Modify: `components/provider/auth-provider.tsx` (add `"use client"`)
- Modify: `app/(dashboard)/dashboard/page.tsx` (add `import { redirect } from "next/navigation";`)
- Modify: `app/(dashboard)/forms/[formId]/page.tsx` (add `import { redirect } from "next/navigation";`)
- Modify: `app/(dashboard)/forms/[formId]/stats/page.tsx` (add `import { redirect } from "next/navigation";`)
- Modify: `app/(dashboard)/forms/[formId]/subs/page.tsx` (add `import { redirect } from "next/navigation";`)

**Step 1: Write code change for layout.tsx**
Add `"use client";` to line 1 of `app/(dashboard)/layout.tsx`.

**Step 2: Write code change for login/page.tsx**
Add `"use client";` to line 1 of `app/(auth)/login/page.tsx`.

**Step 3: Write code change for auth-provider.tsx**
Add `"use client";` to line 1 of `components/provider/auth-provider.tsx`.

**Step 4: Write code changes for redirect imports**
Add `import { redirect } from "next/navigation";` at the top of:
- `app/(dashboard)/dashboard/page.tsx`
- `app/(dashboard)/forms/[formId]/page.tsx`
- `app/(dashboard)/forms/[formId]/stats/page.tsx`
- `app/(dashboard)/forms/[formId]/subs/page.tsx`

**Step 5: Run next build check**
Run: `bun run build`
Expected: Successful compilation without redirect or client Hook errors.

**Step 6: Commit**
```bash
git add app/(dashboard)/layout.tsx app/(auth)/login/page.tsx components/provider/auth-provider.tsx app/(dashboard)/dashboard/page.tsx app/(dashboard)/forms/[formId]/page.tsx app/(dashboard)/forms/[formId]/stats/page.tsx app/(dashboard)/forms/[formId]/subs/page.tsx
git commit -m "fix: add missing client directives and redirect imports"
```

---

### Task 2: Peningkatan Visual Dashboard Cards & Layout

**Files:**
- Modify: `app/(dashboard)/dashboard/page.tsx`

**Step 1: Write code change for cards visual refinement**
Update the form cards in `app/(dashboard)/dashboard/page.tsx`:
- Add transition classes to card wrapper: `transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-700`
- Replace Badge component styling with customized tailwind colors for published status:
  - If published: `<Badge className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100">Published</Badge>`
  - If draft: `<Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">Draft</Badge>`
- Enhance the stats grid inside the card:
  - Add icons `Eye` and `MessageSquare` next to statistic labels.
  - Wrap the grid in an elegant styling.

**Step 2: Verify next build**
Run: `bun run build`
Expected: Build passes with no lint/compilation errors.

**Step 3: Commit**
```bash
git add app/(dashboard)/dashboard/page.tsx
git commit -m "ui: refine dashboard cards with hover effects and custom badges"
```

---

### Task 3: Peningkatan Workspace Builder Sidebar & Canvas

**Files:**
- Modify: `components/builder/designer-canvas.tsx`
- Modify: `components/builder/elements-sidebar.tsx`

**Step 1: Redesign Empty Canvas State**
Replace the simple text in `components/builder/designer-canvas.tsx` with a premium SVG placeholder illustration and styled border:
```tsx
<div className="text-center text-slate-400 dark:text-slate-500 py-16 flex flex-col items-center justify-center gap-4">
  <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-full text-primary animate-pulse">
    <FileSpreadsheet className="h-10 w-10" />
  </div>
  <div>
    <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Kanvas Kosong</p>
    <p className="text-sm text-slate-400 dark:text-slate-500 max-w-xs mt-1">
      Pilih elemen di sebelah kiri atau seret ke sini untuk merancang formulir Anda.
    </p>
  </div>
</div>
```

**Step 2: Add Active Field highlight**
Update `SortableDesignerField` container styling in `components/builder/designer-canvas.tsx` to add a left gradient border and subtle shadow when active:
- Add: `isSelected ? "border-primary border-l-4 border-l-primary bg-slate-50/50 dark:bg-slate-900/30 shadow-md scale-[1.005]" : "..."`

**Step 3: Add sidebar element hover feedback**
Update `DraggableSidebarElement` inside `components/builder/elements-sidebar.tsx`:
- Add transitions: `hover:scale-105 hover:border-primary/50 dark:hover:border-primary/40 hover:shadow-sm duration-200 active:scale-95`

**Step 4: Verify next build**
Run: `bun run build`
Expected: Build successfully completes.

**Step 5: Commit**
```bash
git add components/builder/designer-canvas.tsx components/builder/elements-sidebar.tsx
git commit -m "ui: refine canvas empty state, active element accent and sidebar transitions"
```

---

### Task 4: Redesain Komponen Public Form (File Upload & Rating)

**Files:**
- Modify: `components/builder/public-form.tsx`

**Step 1: Implement Drag & Drop Upload Zone**
In `components/builder/public-form.tsx`, search for `field.type === "file"` and replace it with a styled upload zone component with file preview and instant delete.
- State will track local files or uploaded file name info per field.
- Add file preview card showing: `FileText` icon, file name, file size, success checkmark, and a clear button `X`.

**Step 2: Implement Interactive Rating Bintang**
In `components/builder/public-form.tsx`, update `field.type === "rating"` component block:
- Keep track of hover state index using local component state (e.g. `ratingHover` or `hoverIdx` maps per field).
- Add onMouseEnter and onMouseLeave to star icons.
- Add transition classes: `transition-all duration-150 hover:scale-110 active:scale-95`.

**Step 3: Verify build**
Run: `bun run build`
Expected: Build succeeds.

**Step 4: Commit**
```bash
git add components/builder/public-form.tsx
git commit -m "ui: implement drag-and-drop file upload zone and interactive hover star rating"
```
