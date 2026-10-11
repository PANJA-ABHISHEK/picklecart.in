import { NextResponse } from "next/server";
import crypto from "crypto";
import { adminDb } from "@/lib/firebase/admin";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
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

    // Send confirmation email
    const orderData = (await orderRef.get()).data();
    if (orderData && orderData.customer?.email) {
      // Must await in Next.js route handlers so the process doesn't terminate early
      await sendOrderConfirmationEmail(
        orderRef.id, 
        orderData.customer.email, 
        orderData.customer.fullName, 
        orderData.total
      );
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment verification failed:", error);
    return NextResponse.json({ success: false, error: error.message || "Internal server error" }, { status: 500 });
  }
}
