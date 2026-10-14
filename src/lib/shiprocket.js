export async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error("Shiprocket credentials are not configured.");
  }

  const response = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to authenticate with Shiprocket");
  }

  return data.token;
}

export async function pushOrderToShiprocket(orderId, orderData) {
  try {
    const token = await getShiprocketToken();

    // Map your Firestore orderData to Shiprocket's expected format with safe fallbacks
    const safeDate = (orderData.createdAt && !isNaN(new Date(orderData.createdAt).getTime()))
      ? new Date(orderData.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0];

    const customer = orderData.customer || {};
    const items = Array.isArray(orderData.items) ? orderData.items : [];

    const shippingFee = Number(
      orderData.shippingFee ?? 
      orderData.shipping ?? 
      Math.max(0, (Number(orderData.total) || 0) - (Number(orderData.subtotal) || 0) + (Number(orderData.discount) || 0))
    );
    const discount = Number(orderData.discount ?? 0);
    const subtotal = Number(orderData.subtotal ?? (Number(orderData.total || 0) - shippingFee + discount) ?? 0);

    const shiprocketPayload = {
      order_id: String(orderId), // Your internal order ID
      order_date: safeDate, // YYYY-MM-DD
      pickup_location: "Home", // Must match the Address Nickname in Shiprocket exactly
      billing_customer_name: (customer.fullName || "PickleCart Customer").trim(),
      billing_last_name: "",
      billing_address: (customer.address || "Main Street").trim(),
      billing_city: (customer.city || "Hyderabad").trim(),
      billing_pincode: String(customer.pincode || "500001").trim(),
      billing_state: (customer.state || "Andhra Pradesh").trim(),
      billing_country: "India",
      billing_email: customer.email || "customer@picklecart.in",
      billing_phone: customer.mobile ? String(customer.mobile).replace(/\D/g, '') : "9999999999",
      shipping_is_billing: true,
      order_items: items.length > 0 ? items.map((item, index) => ({
        name: item.name ? `${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ''}` : `Item #${index + 1}`,
        sku: item.variantId || item.productId || `SKU-${index + 1}`,
        units: Number(item.quantity) || 1,
        selling_price: Number(item.price) || 0,
      })) : [{
        name: "PickleCart Product",
        sku: "SKU-DEFAULT",
        units: 1,
        selling_price: Number(orderData.total) || 100
      }],
      payment_method: "Prepaid", // Razorpay means it's prepaid
      sub_total: subtotal,
      shipping_charges: shippingFee,
      total_discount: discount,
      length: 10, // Default dimensions in cm (adjust as needed)
      breadth: 10,
      height: 10,
      weight: 1.0, // Default weight in kg
    };

    const response = await fetch("https://apiv2.shiprocket.in/v1/external/orders/create/adhoc", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(shiprocketPayload)
    });

    const data = await response.json();

    if (!response.ok || (!data.order_id && !data.payload?.order_id)) {
      throw new Error(
        data.message || 
        (data.errors && JSON.stringify(data.errors)) || 
        JSON.stringify(data) || 
        "Failed to create Shiprocket order"
      );
    }

    const srOrderId = data.order_id || data.payload.order_id;
    const srShipmentId = data.shipment_id || data.payload.shipment_id;

    return { success: true, shiprocketOrderId: srOrderId, shipmentId: srShipmentId };
  } catch (error) {
    console.error("Shiprocket integration error:", error);
    return { success: false, error: error.message };
  }
}

export async function getShiprocketTracking(shipmentId) {
  try {
    const token = await getShiprocketToken();
    const response = await fetch(`https://apiv2.shiprocket.in/v1/external/courier/track/shipment/${shipmentId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch tracking data");
    }

    return { success: true, tracking: data };
  } catch (error) {
    console.error("Shiprocket tracking error:", error);
    return { success: false, error: error.message };
  }
}
