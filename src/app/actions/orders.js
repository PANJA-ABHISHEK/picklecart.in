"use server";

import { adminDb } from "@/lib/firebase/admin";
import { pushOrderToShiprocket, getShiprocketTracking } from "@/lib/shiprocket";
import Razorpay from "razorpay";

export async function createOrder(cartItems, customerInfo, promoCode = null) {
  try {

    // 1. Calculate actual total from Firestore to prevent tampering
    let subtotal = 0;
    const items = [];

    for (const cartItem of cartItems) {
      const productDoc = await adminDb.collection("products").doc(cartItem.productId).get();
      if (!productDoc.exists) {
        throw new Error(`Product ${cartItem.productId} not found`);
      }

      const productData = productDoc.data();
      
      // Find the specific variant price (assuming cartItem.variantId maps to index or we compare weight)
      // The variantId in cart is likely the index, but let's check weight if we can, or assume it's index
      // We will match by weight/label
      const variant = productData.pricing.find(
        (p, idx) => cartItem.variantId != null && idx.toString() === cartItem.variantId.toString() || p.weight === cartItem.variantLabel
      );

      if (!variant) {
        throw new Error(`Variant not found for product ${cartItem.name}`);
      }

      const price = Number(variant.price);
      subtotal += price * cartItem.quantity;

      items.push({
        productId: productDoc.id,
        name: productData.name,
        variantLabel: variant.weight,
        price: price,
        quantity: cartItem.quantity,
        image: productData.image,
      });
    }

    // 2. Apply promo code if any
    let discount = 0;
    if (promoCode) {
      // In a real app, query promo codes collection. 
      // For now, we'll keep it simple if it's not fully implemented in db yet.
    }
    
    const total = subtotal - discount;

    if (total <= 0) {
      throw new Error("Invalid order total");
    }

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // 3. Create Razorpay Order
    const options = {
      amount: Math.round(total * 100), // Amount in paise
      currency: "INR",
      receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    };

    const rzpOrder = await razorpay.orders.create(options);

    // 4. Save Pending Order to Firestore
    const orderData = {
      customer: customerInfo,
      items: items,
      subtotal: subtotal,
      discount: discount,
      total: total,
      status: "pending_payment",
      razorpayOrderId: rzpOrder.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const orderRef = await adminDb.collection("orders").add(orderData);

    return {
      success: true,
      orderId: orderRef.id,
      razorpayOrderId: rzpOrder.id,
      amount: options.amount,
      currency: options.currency,
    };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error: error.message || "Failed to create order" };
  }
}

export async function getAdminOrders() {
  try {
    if (!adminDb) return { success: false, orders: [] };
    const snapshot = await adminDb.collection("orders").orderBy("createdAt", "desc").get();
    return {
      success: true,
      orders: snapshot.docs.map(doc => {
        let data = doc.data();
        // Auto-fix for orders that failed to get a shiprocket ID
        if (data.status === "processing" && (!data.shiprocketOrderId || data.shiprocketOrderId === "unknown")) {
          doc.ref.update({ status: "paid", shiprocketOrderId: null, shiprocketShipmentId: null });
          data.status = "paid";
          data.shiprocketOrderId = null;
          data.shiprocketShipmentId = null;
        }
        return { id: doc.id, ...data };
      })
    };
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return { success: false, orders: [] };
  }
}

export async function pushOrderToLogistics(orderId) {
  try {
    if (!adminDb) throw new Error("Database not connected");
    const orderRef = adminDb.collection("orders").doc(orderId);
    const doc = await orderRef.get();
    
    if (!doc.exists) throw new Error("Order not found");
    const orderData = doc.data();

    if (orderData.status !== "paid") {
      throw new Error("Only paid orders can be pushed to Shiprocket");
    }

    if (orderData.shiprocketOrderId) {
      throw new Error("Order is already pushed to Shiprocket");
    }

    const srResult = await pushOrderToShiprocket(orderId, orderData);

    if (srResult.success) {
      await orderRef.update({
        shiprocketOrderId: srResult.shiprocketOrderId ?? null,
        shiprocketShipmentId: srResult.shipmentId ?? null,
        status: "processing", // Move to processing once pushed to logistics
        pushedToLogisticsAt: new Date().toISOString()
      });
      return { success: true };
    } else {
      throw new Error(srResult.error);
    }
  } catch (error) {
    console.error("Failed to push to logistics:", error);
    return { success: false, error: error.message };
  }
}

export async function trackOrder(orderId) {
  try {
    if (!adminDb) return { success: false, error: "Database not connected" };
    
    // Allow users to search by removing the # if they added it
    const cleanOrderId = orderId.replace('#', '').trim();
    const orderRef = adminDb.collection("orders").doc(cleanOrderId);
    let doc = await orderRef.get();
    
    // If not found by direct document ID, allow tracking by mobile number or Shiprocket Order ID
    if (!doc.exists) {
      // 1. Phone number lookup (supporting formats like +91 9381177809 or 9381177809)
      const cleanDigits = cleanOrderId.replace(/\D/g, '');
      const phoneToMatch = cleanDigits.length >= 10 ? cleanDigits.slice(-10) : cleanOrderId;
      
      const phoneSnap = await adminDb.collection("orders")
        .where("customer.phone", "==", phoneToMatch)
        .limit(10)
        .get();

      if (!phoneSnap.empty) {
        const sortedDocs = phoneSnap.docs.sort((a, b) => {
          return new Date(b.data().createdAt || 0) - new Date(a.data().createdAt || 0);
        });
        doc = sortedDocs[0];
      }

      // 2. Shiprocket numeric Order ID match
      if (!doc.exists && !isNaN(cleanOrderId) && cleanOrderId.length > 5) {
        const srSnap = await adminDb.collection("orders")
          .where("shiprocketOrderId", "==", Number(cleanOrderId))
          .limit(1)
          .get();
        if (!srSnap.empty) {
          doc = srSnap.docs[0];
        }
      }
    }
    
    if (!doc.exists) {
      return { success: false, error: "Order not found. Please verify your Order ID or registered 10-digit mobile number." };
    }
    
    const orderData = doc.data();
    let currentStatus = orderData.status;
    let expectedDelivery = "To be updated";
    let courier = "PickleCart Partners";
    let activities = [];

    // Base timeline steps for all orders
    let timeline = [
      { label: "Order Placed", date: new Date(orderData.createdAt).toLocaleDateString('en-IN', {day:'numeric', month:'short'}), completed: true }
    ];

    if (currentStatus === "pending_payment") {
      return {
        success: true,
        data: {
          orderId: doc.id,
          status: "Pending Payment",
          expectedDelivery: "Awaiting Payment",
          carrier: courier,
          steps: timeline
        }
      };
    }

    timeline.push({ label: "Payment Confirmed", date: orderData.paymentVerifiedAt ? new Date(orderData.paymentVerifiedAt).toLocaleDateString('en-IN', {day:'numeric', month:'short'}) : "Done", completed: true });

    if (currentStatus === "paid") {
      timeline.push({ label: "Preparing for Dispatch", date: "Currently in our kitchen", completed: false });
      return {
        success: true,
        data: {
          orderId: doc.id,
          status: "Preparing",
          expectedDelivery: "Will be dispatched soon",
          carrier: courier,
          steps: timeline
        }
      };
    }

    if (orderData.shiprocketShipmentId) {
      const srResult = await getShiprocketTracking(orderData.shiprocketShipmentId);
      
      if (srResult.success && srResult.tracking) {
        // Shiprocket v1 tracking format
        const tData = srResult.tracking[orderData.shiprocketShipmentId]?.tracking_data;
        if (tData) {
          const trackInfo = tData.shipment_track?.[0];
          const trackActivities = tData.shipment_track_activities || [];
          
          if (trackInfo) {
            currentStatus = trackInfo.current_status || "Dispatched";
            courier = trackInfo.courier_name || courier;
            if (trackInfo.edd) {
              expectedDelivery = new Date(trackInfo.edd).toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'});
            }
          }

          if (trackActivities.length > 0) {
            // Sort by date ascending to build timeline
            const sortedActivities = [...trackActivities].sort((a, b) => new Date(a.date) - new Date(b.date));
            sortedActivities.forEach(act => {
              timeline.push({
                label: act.activity,
                date: new Date(act.date).toLocaleString('en-IN', {day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit'}),
                completed: true
              });
            });
            // Add a pending final step if not delivered
            if (currentStatus !== "Delivered" && currentStatus !== "DELIVERED") {
              timeline.push({ label: "Delivered", date: "Pending", completed: false });
            }
          } else {
             // Fallback if no specific scan activities yet but is pushed
             timeline.push({ label: "Dispatched", date: "Handed over to courier", completed: true });
             timeline.push({ label: "In Transit", date: "Awaiting scan updates", completed: false });
          }
        } else {
          timeline.push({ label: "Dispatched", date: "Processing with logistics", completed: true });
        }
      } else {
         timeline.push({ label: "Dispatched", date: "Awaiting carrier updates", completed: true });
      }
    }

    return {
      success: true,
      data: {
        orderId: doc.id,
        status: currentStatus.replace(/_/g, ' ').toUpperCase(),
        expectedDelivery,
        carrier: courier,
        steps: timeline
      }
    };

  } catch (error) {
    console.error("Track order error:", error);
    return { success: false, error: "Failed to fetch tracking data." };
  }
}
