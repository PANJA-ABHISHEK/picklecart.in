import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { sendOrderConfirmationEmail, sendOwnerNewOrderEmail } from "@/lib/email";
import { pushOrderToLogistics } from "@/app/actions/orders";

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const secret = (process.env.RAZORPAY_KEY_SECRET || "").toString().trim().replace(/^["']|["']$/g, '');
    if (!secret) {
      throw new Error("Razorpay secret is not configured on the server.");
    }

    // Verify signature
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    const generated_signature = hmac.digest("hex");

    if (generated_signature !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    // Payment is valid! Update Firestore order status
    // If we have our internal order_id, we update that directly, else we find by razorpayOrderId
    let orderRef;
    if (order_id) {
      orderRef = adminDb.collection("orders").doc(order_id);
    } else {
      const snapshot = await adminDb.collection("orders").where("razorpayOrderId", "==", razorpay_order_id).limit(1).get();
      if (snapshot.empty) {
        throw new Error("Order not found in database for this Razorpay ID");
      }
      orderRef = snapshot.docs[0].ref;
    }

    await orderRef.update({
      status: "paid",
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      paymentVerifiedAt: new Date().toISOString()
    });

    // Send confirmation and notification emails
    const orderData = (await orderRef.get()).data();
    if (orderData) {
      try {
        if (orderData.customer?.email) {
          await sendOrderConfirmationEmail(orderRef.id, orderData);
        }
      } catch (custEmailErr) {
        console.error("Failed to send customer confirmation email:", custEmailErr);
      }

      try {
        await sendOwnerNewOrderEmail(orderRef.id, orderData);
      } catch (ownerEmailErr) {
        console.error("Failed to send owner notification email:", ownerEmailErr);
      }

      // Automatically push order to Shiprocket
      try {
        const logisticsResult = await pushOrderToLogistics(orderRef.id);
        if (logisticsResult.success) {
          console.log(`[Auto-Logistics] Order ${orderRef.id} successfully pushed to Shiprocket!`);
        } else {
          console.warn(`[Auto-Logistics] Shiprocket auto-push notice for ${orderRef.id}:`, logisticsResult.error);
        }
      } catch (srErr) {
        console.error(`[Auto-Logistics] Shiprocket auto-push error for ${orderRef.id}:`, srErr);
      }
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully and order processed" });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}
