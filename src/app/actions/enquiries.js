"use server";

import { adminDb } from "@/lib/firebase/admin";
import { revalidatePath } from "next/cache";

export async function submitContactQuery(data) {
  try {
    const payload = {
      ...data,
      type: "contact",
      status: "new",
      createdAt: new Date().toISOString()
    };
    await adminDb.collection("enquiries").add(payload);
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact query:", error);
    return { success: false, error: "Failed to submit enquiry. Please try again later." };
  }
}

export async function submitBulkEnquiry(data) {
  try {
    const payload = {
      ...data,
      type: "bulk",
      status: "new",
      createdAt: new Date().toISOString()
    };
    await adminDb.collection("enquiries").add(payload);
    return { success: true };
  } catch (error) {
    console.error("Error submitting bulk enquiry:", error);
    return { success: false, error: "Failed to submit bulk enquiry. Please try again later." };
  }
}

export async function getEnquiries(type = "all") {
  try {
    let query = adminDb.collection("enquiries").orderBy("createdAt", "desc");
    if (type !== "all") {
      query = query.where("type", "==", type);
    }
    const snapshot = await query.get();
    const enquiries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return { success: true, enquiries };
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return { success: false, enquiries: [], error: error.message };
  }
}

export async function markEnquiryStatus(id, status) {
  try {
    await adminDb.collection("enquiries").doc(id).update({ status });
    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteEnquiry(id) {
  try {
    await adminDb.collection("enquiries").doc(id).delete();
    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
