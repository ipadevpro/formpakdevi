# Calendar Year Dropdown Integration Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Modify the Shadcn UI Calendar component (`components/ui/calendar.tsx`) to support native dropdown selections for both Month and Year, covering a dynamic 100-year range.

**Architecture:** Use built-in options of `react-day-picker` v9 (`captionLayout="dropdown"`, `startMonth`, `endMonth`) and override Tailwind classes inside the `classNames` configuration.

**Tech Stack:** Next.js, Shadcn UI Calendar, react-day-picker v9.

---

## Tasks Overview

- [ ] Task 1: Modify Calendar Component Configuration and Styles

---

## Detailed Task Steps

### Task 1: Modify Calendar Component Configuration and Styles

**Files:**
- Modify: `components/ui/calendar.tsx`

**Step 1: Check existing calendar implementation**
Read `components/ui/calendar.tsx` to locate `captionLayout` and `classNames` options.

**Step 2: Add startMonth, endMonth, and captionLayout**
Modify `components/ui/calendar.tsx`:
- Import `subYears` / `addYears` from `date-fns` (or compute native dates).
- Set `captionLayout="dropdown"`.
- Set `startMonth={new Date(new Date().getFullYear() - 100, 0)}`.
- Set `endMonth={new Date(new Date().getFullYear() + 2, 11)}`.
- Add dropdown styling properties to `classNames` object.

**Step 3: Verification & Commit**
Verify build compilation: `bun run build`
Commit:
```bash
git add components/ui/calendar.tsx
git commit -m "feat: add dropdown month and year selection support in calendar component"
```
