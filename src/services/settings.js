"use server";

import { adminDb } from "@/lib/firebase/admin";
import { connection } from "next/server";

export async function getStoreSettings() {
  try {
    await connection();
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
    await connection();
    const docRef = adminDb.collection("settings").doc("store");
    await docRef.set(data, { merge: true });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
