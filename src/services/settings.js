"use server";

import { adminDb } from "@/lib/firebase/admin";

export async function getStoreSettings() {
  try {
    if (!adminDb) {
      return {
        announcement: {
          enabled: false,
          text: "",
          bgColor: "bg-earthy-brown",
          textColor: "text-white"
        }
      };
    }
    const docRef = adminDb.collection("settings").doc("store");
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      return docSnap.data();
    }
    
    return {
      announcement: {
        enabled: false,
        text: "",
        bgColor: "bg-earthy-brown",
        textColor: "text-white"
      }
    };
  } catch (error) {
    return {
      announcement: {
        enabled: false,
        text: "",
        bgColor: "bg-earthy-brown",
        textColor: "text-white"
      }
    };
  }
}

export async function updateStoreSettings(data) {
  try {
    if (!adminDb) return { success: false, error: "Database not connected" };
    const docRef = adminDb.collection("settings").doc("store");
    await docRef.set(data, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
