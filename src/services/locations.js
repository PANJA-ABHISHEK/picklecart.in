import { adminDb } from "@/lib/firebase/admin";
import { FieldValue } from "firebase-admin/firestore";

const COLLECTION = "locations";

/**
 * Get all locations, ordered by createdAt
 */
export async function getLocations() {
  try {
    const snapshot = await adminDb.collection(COLLECTION).orderBy("createdAt", "asc").get();
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching locations:", error);
    return [];
  }
}

/**
 * Get a single location by ID
 */
export async function getLocation(id) {
  try {
    const doc = await adminDb.collection(COLLECTION).doc(id).get();
    if (!doc.exists) return null;
    return {
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
      updatedAt: doc.data().updatedAt?.toDate()?.toISOString() || new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
}

/**
 * Create a new location
 */
export async function createLocation(data) {
  try {
    const docRef = await adminDb.collection(COLLECTION).add({
      ...data,
      isPrimary: data.isPrimary || false,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    
    // If this is set as primary, unset others
    if (data.isPrimary) {
      await unsetOtherPrimaryLocations(docRef.id);
    }
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error creating location:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Update an existing location
 */
export async function updateLocation(id, data) {
  try {
    const cleanData = { ...data };
    delete cleanData.id;
    delete cleanData.createdAt; // Prevent overwriting

    await adminDb.collection(COLLECTION).doc(id).update({
      ...cleanData,
      updatedAt: FieldValue.serverTimestamp(),
    });
    
    // If this is set as primary, unset others
    if (data.isPrimary) {
      await unsetOtherPrimaryLocations(id);
    }
    
    return { success: true };
  } catch (error) {
    console.error("Error updating location:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete a location
 */
export async function deleteLocation(id) {
  try {
    await adminDb.collection(COLLECTION).doc(id).delete();
    return { success: true };
  } catch (error) {
    console.error("Error deleting location:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Helper to ensure only one primary location exists
 */
async function unsetOtherPrimaryLocations(primaryId) {
  try {
    const snapshot = await adminDb.collection(COLLECTION)
      .where("isPrimary", "==", true)
      .get();
      
    const batch = adminDb.batch();
    let hasUpdates = false;
    
    snapshot.docs.forEach(doc => {
      if (doc.id !== primaryId) {
        batch.update(doc.ref, { isPrimary: false });
        hasUpdates = true;
      }
    });
    
    if (hasUpdates) {
      await batch.commit();
    }
  } catch (error) {
    console.error("Error updating primary locations:", error);
  }
}

/**
 * Seed initial location if the collection is empty
 */
export async function seedInitialLocation() {
  try {
    const locations = await getLocations();
    if (locations.length > 0) return locations;

    const initialLocation = {
      name: "PickleCart Bangalore",
      address: "3rd Main, opposite ECO Hypermarket, near Alfa Gardens, Kodigehalli Main Road, K. R. Puram, Bangalore, India 560036.",
      phone: "+91 81238 08404",
      whatsapp: "+91 81238 08404",
      email: "picklecartblr@gmail.com",
      hours: "11:00 AM – 9:00 PM",
      mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d12182.30520634488!2d78.474629!3d17.385044!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb99daeaebd2c7%3A0xae93b78392bafbc2!2sHyderabad%2C%20Telangana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
      isPrimary: true
    };

    await createLocation(initialLocation);
    return await getLocations();
  } catch (error) {
    console.error("Error seeding location:", error);
    return [];
  }
}
