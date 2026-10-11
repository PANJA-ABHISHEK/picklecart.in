"use server";

import { adminDb } from "@/lib/firebase/admin";

const defaultSettings = {
  announcement: {
    enabled: true,
    text: "🚚 Free delivery above ₹1,500 — India delivery addresses only",
    bgColor: "bg-[#B84A32]",
    textColor: "text-white"
  },
  shipping: {
    defaultFee: 99,
    freeThreshold: 1500
  }
};

export async function getStoreSettings() {
  try {
    if (!adminDb) return defaultSettings;
    const docRef = adminDb.collection("settings").doc("store");
    const docSnap = await docRef.get();
    
    if (docSnap.exists) {
      const data = docSnap.data() || {};
      return {
        ...defaultSettings,
        ...data,
        announcement: {
          ...defaultSettings.announcement,
          ...(data.announcement || {})
        },
        shipping: {
          defaultFee: Number(data?.shipping?.defaultFee) >= 0 ? Number(data.shipping.defaultFee) : 99,
          freeThreshold: Number(data?.shipping?.freeThreshold) >= 0 ? Number(data.shipping.freeThreshold) : 1500
        }
      };
    }
    
    return defaultSettings;
  } catch (error) {
    console.error("Error reading store settings:", error);
    return defaultSettings;
  }
}

export async function updateStoreSettings(data) {
  try {
    if (!adminDb) return { success: false, error: "Database not connected" };
    const docRef = adminDb.collection("settings").doc("store");
    
    const payload = {
      ...data,
      shipping: {
        defaultFee: Number(data?.shipping?.defaultFee) >= 0 ? Number(data.shipping.defaultFee) : 99,
        freeThreshold: Number(data?.shipping?.freeThreshold) >= 0 ? Number(data.shipping.freeThreshold) : 1500
      },
      updatedAt: new Date().toISOString()
    };

    await docRef.set(payload, { merge: true });
    return { success: true };
  } catch (error) {
    console.error("Error updating store settings:", error);
    return { success: false, error: error.message };
  }
}
