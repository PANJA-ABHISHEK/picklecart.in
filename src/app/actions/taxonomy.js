"use server";

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

// ==========================================
// CATEGORIES
// ==========================================

export async function createCategory(data) {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const payload = {
      name: data.name,
      description: data.description || "",
      regions: data.regions || [],
      id: slug,
      createdAt: new Date().toISOString(),
    };
    await adminDb.collection("categories").doc(slug).set(payload);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products/new");
    revalidatePath("/admin/products");
    return { success: true, id: slug };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateCategory(id, data) {
  try {
    const payload = {
      name: data.name,
      description: data.description || "",
      regions: data.regions || [],
      updatedAt: new Date().toISOString(),
    };
    await adminDb.collection("categories").doc(id).update(payload);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products/new");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getCategories() {
  try {
    const snapshot = await adminDb.collection("categories").get();
    const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, categories };
  } catch (error) {
    return { success: false, error: error.message, categories: [] };
  }
}

export async function deleteCategory(id) {
  try {
    await adminDb.collection("categories").doc(id).delete();
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products/new");
    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// ==========================================
// REGIONS
// ==========================================

export async function createRegion(data) {
  try {
    const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const payload = { ...data, id: slug, createdAt: new Date().toISOString() };
    await adminDb.collection("regions").doc(slug).set(payload);
    revalidatePath("/admin/categories");
    return { success: true, id: slug };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getRegions() {
  try {
    const snapshot = await adminDb.collection("regions").get();
    const regions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, regions };
  } catch (error) {
    return { success: false, error: error.message, regions: [] };
  }
}

export async function deleteRegion(id) {
  try {
    await adminDb.collection("regions").doc(id).delete();
    revalidatePath("/admin/categories");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
