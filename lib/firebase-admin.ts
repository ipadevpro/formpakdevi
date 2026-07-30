import { initializeApp, getApps, cert, getApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

let db: ReturnType<typeof getFirestore> | null = null;
let adminAuth: ReturnType<typeof getAuth> | null = null;

const hasAdminCredentials =
  process.env.FIREBASE_PROJECT_ID &&
  process.env.FIREBASE_CLIENT_EMAIL &&
  process.env.FIREBASE_PRIVATE_KEY &&
  !process.env.FIREBASE_PRIVATE_KEY.includes("YOUR_PRIVATE_KEY_HERE");

if (hasAdminCredentials) {
  try {
    const apps = getApps();
    const app = apps.length
      ? getApp()
      : initializeApp({
          credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n").replace(/^"|"$/g, ""),
          }),
        });
    db = getFirestore(app);
    adminAuth = getAuth(app);
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    db = null;
    adminAuth = null;
  }
} else if (process.env.NODE_ENV !== "production") {
  console.warn(
    "Firebase Admin credentials are not fully configured. Using mock/empty DB placeholders for build safety."
  );
}

export { db, adminAuth };
