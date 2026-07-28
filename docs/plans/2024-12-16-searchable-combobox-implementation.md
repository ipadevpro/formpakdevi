# Searchable Combobox Feature Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate a searchable dropdown selector (Combobox) inside the Select field type, controlled by a toggle switch under the builder properties panel.

**Architecture:** Extend the `FormField` type configuration with a `searchable` validation flag. Use Shadcn UI `<Command>` and `cmdk` component package to handle fuzzy filtering, wrapped in a `<Popover>`.

**Tech Stack:** Next.js, Shadcn UI Popover, Command, cmdk, Lucide React.

---

## Tasks Overview

- [ ] Task 1: Type Updates & Installing Shadcn Command Component
- [ ] Task 2: Properties Panel Searchable Switch Integration
- [ ] Task 3: Public Form Renderer Combobox Integration

---

## Detailed Task Steps

### Task 1: Type Updates & Installing Shadcn Command Component

**Files:**
- Modify: `lib/types.ts:16-25`
- Create: `components/ui/command.tsx`

**Step 1: Update type schema**
Add `searchable?: boolean;` to `FormField['validation']` block in `lib/types.ts`.

**Step 2: Add Shadcn command component**
Run: `bunx shadcn@latest add command -y`
Expected: `components/ui/command.tsx` created successfully.

**Step 3: Verification & Commit**
Verify build compilation: `bunx tsc --noEmit`
Commit:
```bash
git add lib/types.ts components/ui/command.tsx
git commit -m "chore: add searchable field to type schema and install shadcn command UI"
```

---

### Task 2: Properties Panel Searchable Switch Integration

**Files:**
- Modify: `components/builder/properties-panel.tsx`

**Step 1: Edit Properties panel render**
In `components/builder/properties-panel.tsx`, add a conditional section when `activeField.type === "select"`. Render a Switch toggling `validation.searchable`.

**Step 2: Verification & Commit**
Verify compiler: `bunx tsc --noEmit`
Commit:
```bash
git add components/builder/properties-panel.tsx
git commit -m "feat: integrate searchable toggle in builder properties panel"
```

---

### Task 3: Public Form Renderer Combobox Integration

**Files:**
- Modify: `components/builder/public-form.tsx`

**Step 1: Import command UI modules**
Import `Command`, `CommandEmpty`, `CommandGroup`, `CommandInput`, `CommandItem`, `CommandList` from `@/components/ui/command` and `ChevronsUpDown`, `Check` icons from `lucide-react`.

**Step 2: Add popover state wrapper**
Add a local dictionary state to track popover states: `const [popoverOpen, setPopoverOpen] = useState<Record<string, boolean>>({});`.

**Step 3: Modify field conditional**
In `public-form.tsx` select field renderer, evaluate `field.validation?.searchable`. If true, render the Combobox popover. If false, render the standard Select dropdown.

**Step 4: Verification & Commit**
Verify compilation and run clean production builds: `bun run build`
Commit:
```bash
git add components/builder/public-form.tsx
git commit -m "feat: implement searchable combobox in public form renderer"
```
