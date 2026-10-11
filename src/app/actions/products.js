"use server";

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

export async function createProduct(productData) {
  try {
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Add timestamps
    const product = {
      ...productData,
      id: slug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection("products").doc(slug).set(product);
    
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath("/products");
    
    return { success: true, id: slug };
  } catch (error) {
    console.error("Error creating product:", error);
    return { success: false, error: error.message };
  }
}

export async function getProducts() {
  try {
    const snapshot = await adminDb.collection("products").orderBy("createdAt", "desc").get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: error.message, products: [] };
  }
}

export async function deleteProduct(id) {
  try {
    await adminDb.collection("products").doc(id).delete();
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { success: false, error: error.message };
  }
}

export async function toggleProductStock(id, newPricingState) {
  try {
    await adminDb.collection("products").doc(id).update({
      pricing: newPricingState
    });
    revalidatePath("/admin/products");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating stock:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProduct(id, productData) {
  try {
    const updateData = {
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    
    await adminDb.collection("products").doc(id).update(updateData);
    
    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath(`/product/${id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Error updating product:", error);
    return { success: false, error: error.message };
  }
}
