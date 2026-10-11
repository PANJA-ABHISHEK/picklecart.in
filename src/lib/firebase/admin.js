import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

function cleanEnv(val) {
  if (!val) return val;
  let str = val.trim();
  if ((str.startsWith('"') && str.endsWith('"')) || (str.startsWith("'") && str.endsWith("'"))) {
    str = str.slice(1, -1);
  }
  return str;
}

if (!getApps().length) {
  try {
    let privateKey = cleanEnv(process.env.FIREBASE_PRIVATE_KEY);
    if (privateKey) {
      privateKey = privateKey.replace(/\\n/g, "\n");
    }

    const projectId = cleanEnv(process.env.FIREBASE_PROJECT_ID);
    const clientEmail = cleanEnv(process.env.FIREBASE_CLIENT_EMAIL);

    if (projectId && clientEmail && privateKey) {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } else {
      console.warn("Firebase Admin credentials incomplete; running without full Admin SDK.");
    }
  } catch (error) {
    console.error("Firebase admin initialization error:", error);
  }
}

export const adminAuth = getApps().length ? getAuth() : null;
export const adminDb = getApps().length ? getFirestore() : null;

