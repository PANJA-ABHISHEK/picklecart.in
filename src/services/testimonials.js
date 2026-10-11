"use server";

import { adminDb } from "@/lib/firebase/admin";

export async function getTestimonials() {
  try {
    if (!adminDb) return [];
    const snapshot = await adminDb.collection("testimonials").orderBy("createdAt", "desc").get();
    
    const testimonials = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Auto-seed initial realistic testimonials if empty
    if (testimonials.length === 0) {
      return await seedTestimonials();
    }

    return testimonials;
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

export async function addTestimonial(data) {
  try {
    if (!adminDb) return { success: false, error: "Database not connected" };
    const docRef = await adminDb.collection("testimonials").add({
      ...data,
      createdAt: new Date().toISOString()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateTestimonial(id, data) {
  try {
    if (!adminDb) return { success: false, error: "Database not connected" };
    await adminDb.collection("testimonials").doc(id).update(data);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteTestimonial(id) {
  try {
    if (!adminDb) return { success: false, error: "Database not connected" };
    await adminDb.collection("testimonials").doc(id).delete();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function seedTestimonials() {
  const seedData = [
    {
      customerName: "Rajesh Kumar",
      location: "Hyderabad, Telangana",
      rating: 5,
      comment: "I've been ordering the chicken pickle and gongura pickle regularly. The taste is consistently excellent. The packaging is neat, and delivery is always on time. Highly recommended!",
      createdAt: new Date(Date.now() - 100000).toISOString()
    },
    {
      customerName: "Ananya Reddy",
      location: "Chennai, Tamil Nadu",
      rating: 5,
      comment: "The idli podi and curry leaf podi are absolutely fantastic. They remind me of the homemade podis from my native village. PickleCart has become our family's go-to for authentic South Indian food.",
      createdAt: new Date(Date.now() - 200000).toISOString()
    },
    {
      customerName: "Suresh Nair",
      location: "Mumbai, Maharashtra",
      rating: 5,
      comment: "Living away from home, I really missed authentic Andhra pickles. PickleCart delivers the real deal. The gongura karam is addictive! Great products and reliable service.",
      createdAt: new Date(Date.now() - 300000).toISOString()
    },
    {
      customerName: "Priya Sharma",
      location: "Delhi, NCR",
      rating: 5,
      comment: "Ordered the Mango Avakaya and it was a burst of flavors! It pairs perfectly with plain rice and ghee. I am so glad I found this website. Ordering my next batch soon.",
      createdAt: new Date(Date.now() - 400000).toISOString()
    },
    {
      customerName: "Karthik V.",
      location: "Bangalore, Karnataka",
      rating: 5,
      comment: "The Mutton Pickle is out of this world. Perfectly spiced, tender meat pieces, and just the right amount of oil. The quality is easily much better than anything you find in supermarkets.",
      createdAt: new Date(Date.now() - 500000).toISOString()
    },
    {
      customerName: "Sneha Desai",
      location: "Pune, Maharashtra",
      rating: 5,
      comment: "I sent a gift box of assorted sweets and podis to my parents. They loved the authentic taste and the premium packaging. Thank you PickleCart for making their day special!",
      createdAt: new Date(Date.now() - 600000).toISOString()
    }
  ];

  const batch = adminDb.batch();
  const addedDocs = [];

  for (const item of seedData) {
    const docRef = adminDb.collection("testimonials").doc();
    batch.set(docRef, item);
    addedDocs.push({ id: docRef.id, ...item });
  }

  await batch.commit();
  return addedDocs;
}
