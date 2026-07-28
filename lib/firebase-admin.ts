import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const hasAdminCredentials =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY &&
  !process.env.FIREBASE_PRIVATE_KEY.includes("YOUR_PRIVATE_KEY_HERE");

let appInstance: any = null;

if (hasAdminCredentials) {
  const apps = getApps();
  if (!apps.length) {
    try {
      appInstance = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
      });
    } catch (error) {
      console.error("Firebase Admin initialization error during startup:", error);
    }
  } else {
    appInstance = getApp();
  }
} else {
  if (process.env.NODE_ENV !== "production") {
    console.warn(
      "Firebase Admin credentials are not fully configured. Using mock/empty DB placeholders for build safety."
    );
  }
}

// Export database and auth instances safely
// If not initialized, access will throw a clear warning, but won't crash the Next.js compilation step
export const db = hasAdminCredentials ? getFirestore() : (null as any);
export const adminAuth = hasAdminCredentials ? getAuth() : (null as any);
