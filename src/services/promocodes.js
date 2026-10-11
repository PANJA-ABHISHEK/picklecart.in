"use server";

import { adminDb } from "@/lib/firebase/admin";
import { connection } from "next/server";

export async function getPromoCodes() {
  try {
    await connection();
    const snapshot = await adminDb.collection("promocodes").orderBy("createdAt", "desc").get();
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    return [];
  }
}

export async function addPromoCode(data) {
  try {
    await connection();
    
    // Convert code to uppercase and remove spaces
    const cleanCode = data.code.toUpperCase().replace(/\s+/g, '');
    
    // Check if code already exists
    const existing = await adminDb.collection("promocodes").where("code", "==", cleanCode).get();
    if (!existing.empty) {
      return { success: false, error: "A promo code with this name already exists." };
    }

    const docRef = await adminDb.collection("promocodes").add({
      ...data,
      code: cleanCode,
      timesUsed: 0,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updatePromoCode(id, data) {
  try {
    await connection();
    
    // If updating the code string itself, ensure it's uppercase and unique
    if (data.code) {
      data.code = data.code.toUpperCase().replace(/\s+/g, '');
      const existing = await adminDb.collection("promocodes")
        .where("code", "==", data.code)
        .get();
        
      if (!existing.empty && existing.docs[0].id !== id) {
        return { success: false, error: "A promo code with this name already exists." };
      }
    }
    
    await adminDb.collection("promocodes").doc(id).update(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deletePromoCode(id) {
  try {
    await connection();
    await adminDb.collection("promocodes").doc(id).delete();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function validatePromoCode(code, cartTotal) {
  try {
    await connection();
    const cleanCode = code.toUpperCase().replace(/\s+/g, '');
    
    const snapshot = await adminDb.collection("promocodes").where("code", "==", cleanCode).get();
    
    if (snapshot.empty) {
      return { valid: false, error: "Invalid promo code." };
    }

    const promo = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };

    if (!promo.isActive) {
      return { valid: false, error: "This promo code is no longer active." };
    }

    if (promo.minOrderValue && cartTotal < promo.minOrderValue) {
      return { valid: false, error: `Cart total must be at least ₹${promo.minOrderValue} to use this code.` };
    }

    if (promo.expiryDate && new Date(promo.expiryDate) < new Date()) {
      return { valid: false, error: "This promo code has expired." };
    }
    
    if (promo.usageLimit && promo.timesUsed >= promo.usageLimit) {
      return { valid: false, error: "This promo code has reached its usage limit." };
    }

    // Calculate discount amount
    let discountAmount = 0;
    if (promo.discountType === "percentage") {
      discountAmount = (cartTotal * promo.discountValue) / 100;
      if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
        discountAmount = promo.maxDiscount;
      }
    } else {
      // Fixed amount
      discountAmount = promo.discountValue;
    }

    // Never discount more than the cart total
    if (discountAmount > cartTotal) {
      discountAmount = cartTotal;
    }

    return { 
      valid: true, 
      promo: {
        id: promo.id,
        code: promo.code,
        discountAmount,
        type: promo.discountType,
        value: promo.discountValue
      }
    };
  } catch (error) {
    return { valid: false, error: "Failed to validate promo code." };
  }
}
