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

    // Map your Firestore orderData to Shiprocket's expected format
    const shiprocketPayload = {
      order_id: orderId, // Your internal order ID
      order_date: new Date(orderData.createdAt).toISOString().split('T')[0], // YYYY-MM-DD
      pickup_location: "Home", // Must match the Address Nickname in Shiprocket exactly
      billing_customer_name: orderData.customer.fullName,
      billing_last_name: "",
      billing_address: orderData.customer.address,
      billing_city: orderData.customer.city,
      billing_pincode: orderData.customer.pincode,
      billing_state: orderData.customer.state,
      billing_country: "India",
      billing_email: orderData.customer.email,
      billing_phone: orderData.customer.mobile,
      shipping_is_billing: true,
      order_items: orderData.items.map(item => ({
        name: item.name,
        sku: item.productId, // using productId as SKU for simplicity
        units: item.quantity,
        selling_price: item.price,
      })),
      payment_method: "Prepaid", // Razorpay means it's prepaid
      sub_total: orderData.subtotal,
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
