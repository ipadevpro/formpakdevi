# Changelog

## 2026-07-30 - Fix Google Login 500 Error

### Root Cause Analysis
The 500 HTML error during Google login was caused by multiple issues in the auth session flow:

1. **`firebase-admin.ts` could crash at module level** — When `initializeApp()` failed (caught by try/catch), the code still called `getFirestore()` and `getAuth()` because `hasAdminCredentials` was still truthy. These calls without a valid app would throw an unhandled error at module import time, causing Next.js to return a 500 HTML error overlay instead of JSON.

2. **`maxAge` used milliseconds instead of seconds** — `cookieStore.set()` expects `maxAge` in seconds, but the code passed `432000000` (milliseconds = ~13.7 years). This was changed to `432000` (5 days in seconds).

3. **`sameSite: "strict"` blocks OAuth flows** — Changed to `"lax"` which allows cookies on same-site navigations and top-level GET requests from external sites, which is the correct setting for OAuth-based auth.

### Changes
- `lib/firebase-admin.ts`: Rewrote initialization to only call `getFirestore()`/`getAuth()` after successful `initializeApp()`. All wrapped in single try/catch.
- `app/api/auth/session/route.ts`: Dynamic import of firebase-admin (prevents module-level crash from breaking the route), fixed `maxAge` units, changed `sameSite` to `"lax"`, added specific error messages.
- `app/(auth)/login/page.tsx`: Removed duplicate `"use client"` directive.
