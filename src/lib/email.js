import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const OWNER_EMAIL = process.env.OWNER_NOTIFICATION_EMAIL || 'picklecartblr@gmail.com';

function renderItemsHtml(items = []) {
  if (!items || items.length === 0) {
    return '<p style="color: #6b7280; font-size: 14px; margin: 10px 0;">No product items listed.</p>';
  }

  const rows = items.map((item, index) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    return `
      <tr style="border-bottom: 1px solid #f0ece1; background-color: ${index % 2 === 0 ? '#ffffff' : '#faf8f5'};">
        <td style="padding: 12px 10px; font-size: 14px; color: #222222;">
          <strong>${item.name || 'Product'}</strong>
          ${item.variantLabel ? `<div style="color: #786c5e; font-size: 12px; margin-top: 2px;">Variant: ${item.variantLabel}</div>` : ''}
        </td>
        <td style="padding: 12px 10px; font-size: 14px; text-align: center; color: #555555;">
          ${item.quantity || 1}
        </td>
        <td style="padding: 12px 10px; font-size: 14px; text-align: right; color: #222222;">
          ₹${item.price || 0}
        </td>
        <td style="padding: 12px 10px; font-size: 14px; text-align: right; font-weight: bold; color: #8C2D19;">
          ₹${itemTotal}
        </td>
      </tr>
    `;
  }).join('');

  return `
    <table style="width: 100%; border-collapse: collapse; margin-top: 12px; border: 1px solid #e7e0d3; border-radius: 6px; overflow: hidden;">
      <thead>
        <tr style="background-color: #f4eee2; border-bottom: 2px solid #ded4c1; text-align: left;">
          <th style="padding: 10px; font-size: 12px; color: #4A2E18; text-transform: uppercase; letter-spacing: 0.05em;">Product</th>
          <th style="padding: 10px; font-size: 12px; color: #4A2E18; text-align: center; text-transform: uppercase; letter-spacing: 0.05em;">Qty</th>
          <th style="padding: 10px; font-size: 12px; color: #4A2E18; text-align: right; text-transform: uppercase; letter-spacing: 0.05em;">Price</th>
          <th style="padding: 10px; font-size: 12px; color: #4A2E18; text-align: right; text-transform: uppercase; letter-spacing: 0.05em;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

/**
 * Send order confirmation email to customer
 */
export async function sendOrderConfirmationEmail(orderId, dataOrEmail, customerName, total) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key missing, skipping customer confirmation email.");
    return null;
  }

  let customerEmail = "";
  let name = "";
  let orderTotal = 0;
  let items = [];
  let customerInfo = null;

  if (typeof dataOrEmail === "object" && dataOrEmail !== null) {
    customerEmail = dataOrEmail.customer?.email;
    name = dataOrEmail.customer?.fullName || "Valued Customer";
    orderTotal = dataOrEmail.total;
    items = dataOrEmail.items || [];
    customerInfo = dataOrEmail.customer;
  } else {
    customerEmail = dataOrEmail;
    name = customerName || "Valued Customer";
    orderTotal = total;
  }

  if (!customerEmail) {
    console.warn("No customer email provided for order", orderId);
    return null;
  }

  const addressParts = customerInfo
    ? [
        customerInfo.address,
        customerInfo.landmark ? `(Landmark: ${customerInfo.landmark})` : null,
        customerInfo.city,
        customerInfo.state,
        customerInfo.pincode ? `- ${customerInfo.pincode}` : null,
      ].filter(Boolean)
    : [];
  const deliveryAddress = addressParts.join(", ");
  const itemsTable = renderItemsHtml(items);

  try {
    const { data, error } = await resend.emails.send({
      from: 'PickleCart <orders@picklecart.in>',
      to: [customerEmail],
      subject: `Order Confirmed! #${orderId} - PickleCart`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px 16px; background-color: #f7f4ed;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border: 1px solid #e7e0d3;">
            
            <!-- Header Banner -->
            <div style="background-color: #8C2D19; padding: 28px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">PickleCart</h1>
              <p style="color: #F8D98C; margin: 6px 0 0 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.15em;">Fill Your Cart with Tradition</p>
            </div>

            <!-- Body Content -->
            <div style="padding: 28px 24px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="display: inline-block; background-color: #ecfdf5; color: #047857; font-weight: 600; font-size: 12px; padding: 4px 12px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.05em; border: 1px solid #a7f3d0;">Payment Verified</span>
                <h2 style="color: #222222; font-size: 22px; margin: 12px 0 4px 0;">Order Confirmed!</h2>
                <p style="color: #666666; font-size: 14px; margin: 0;">Hi <strong>${name}</strong>, thank you for your order. We are hand-crafting and packing your traditional flavours!</p>
              </div>

              <!-- Order Summary Card -->
              <div style="background-color: #fcfbf9; border: 1px solid #e7e0d3; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
                  <span style="color: #666666;">Order ID:</span>
                  <strong style="color: #222222; font-family: monospace;">#${orderId}</strong>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 14px; margin-bottom: 8px;">
                  <span style="color: #666666;">Order Date:</span>
                  <span style="color: #222222;">${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 15px; padding-top: 8px; border-top: 1px dashed #ded4c1;">
                  <span style="color: #222222; font-weight: 600;">Total Amount Paid:</span>
                  <strong style="color: #8C2D19; font-size: 17px;">₹${orderTotal}</strong>
                </div>
              </div>

              <!-- Items Ordered -->
              <h3 style="color: #4A2E18; font-size: 16px; margin: 0 0 8px 0; border-bottom: 1px solid #f0ece1; padding-bottom: 6px;">Your Ordered Items</h3>
              ${itemsTable}

              <!-- Shipping Address -->
              ${deliveryAddress ? `
                <div style="margin-top: 24px; padding: 16px; background-color: #fcfbf9; border-radius: 8px; border: 1px solid #e7e0d3;">
                  <h4 style="margin: 0 0 6px 0; color: #4A2E18; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Shipping Details</h4>
                  <p style="margin: 0; color: #444444; font-size: 14px; line-height: 1.5;">
                    <strong>${name}</strong><br/>
                    ${deliveryAddress}<br/>
                    ${customerInfo?.phone ? `Phone: ${customerInfo.phone}` : ''}
                  </p>
                </div>
              ` : ''}

              <!-- Track Button -->
              <div style="text-align: center; margin-top: 28px;">
                <a href="https://picklecart.in/track?orderId=${orderId}" style="display: inline-block; background-color: #8C2D19; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 600; padding: 12px 28px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(140,45,25,0.25);">
                  Track Your Order Online
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f7f4ed; border-top: 1px solid #e7e0d3; padding: 18px 24px; text-align: center;">
              <p style="font-size: 12px; color: #786c5e; margin: 0;">Have questions? Reply to this email or visit <a href="https://picklecart.in/contact" style="color: #8C2D19; text-decoration: underline;">picklecart.in/contact</a></p>
              <p style="font-size: 11px; color: #a39583; margin: 6px 0 0 0;">© ${new Date().getFullYear()} PickleCart. Authentic Indian Traditional Flavours.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[Email] Resend customer confirmation email error:", error);
      return { success: false, error };
    }
    console.log(`[Email] Customer confirmation email sent successfully to ${customerEmail} (ID: ${data?.id})`);
    return { success: true, data };
  } catch (err) {
    console.error("[Email] Failed to send customer confirmation email:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Send new order notification to the store owner
 */
export async function sendOwnerNewOrderEmail(orderId, orderData) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key missing, skipping owner order notification.");
    return null;
  }

  const customer = orderData.customer || {};
  const items = orderData.items || [];
  const total = orderData.total || 0;
  const subtotal = orderData.subtotal || total;
  const discount = orderData.discount || 0;
  const shipping = orderData.shipping !== undefined ? orderData.shipping : (subtotal >= 1500 ? 0 : 99);
  const paymentId = orderData.razorpayPaymentId || "N/A";
  const customerName = customer.fullName || "Customer";
  const customerPhone = customer.mobile || customer.phone || "Not provided";
  const customerEmail = customer.email || "Not provided";
  const addressList = [
    customer.address,
    customer.landmark ? `Landmark: ${customer.landmark}` : null,
    customer.city,
    customer.state,
    customer.pincode ? `- ${customer.pincode}` : null,
  ].filter(Boolean);
  const fullAddress = addressList.length > 0 ? addressList.join(", ") : "Not provided";

  const itemsTable = renderItemsHtml(items);

  try {
    const { data, error } = await resend.emails.send({
      from: 'PickleCart Orders <orders@picklecart.in>',
      to: [OWNER_EMAIL],
      subject: `🚨 New Order #${orderId} Received! ₹${total} from ${customerName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px 16px; background-color: #f3f4f6;">
          <div style="max-width: 640px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e5e7eb;">
            
            <!-- Alert Banner -->
            <div style="background-color: #1e3a8a; padding: 22px 24px; text-align: left;">
              <span style="display: inline-block; background-color: #3b82f6; color: #ffffff; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 4px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;">New Order Alert</span>
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Order #${orderId} Received</h1>
              <p style="color: #bfdbfe; margin: 4px 0 0 0; font-size: 14px;">Total Amount: <strong style="color: #ffffff; font-size: 16px;">₹${total}</strong> (Payment Verified)</p>
            </div>

            <!-- Body -->
            <div style="padding: 24px;">

              <!-- Customer Details Section -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                <h3 style="margin: 0 0 12px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px;">👤 Customer & Shipping Information</h3>
                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; width: 140px;">Name:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${customerName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Phone:</td>
                    <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">
                      <a href="tel:${customerPhone}" style="color: #2563eb; text-decoration: none;">${customerPhone}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b;">Email:</td>
                    <td style="padding: 6px 0; color: #0f172a;">
                      <a href="mailto:${customerEmail}" style="color: #2563eb; text-decoration: none;">${customerEmail}</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Delivery Address:</td>
                    <td style="padding: 6px 0; color: #0f172a; line-height: 1.4;">
                      ${fullAddress}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- Ordered Items -->
              <h3 style="margin: 0 0 10px 0; color: #0f172a; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em;">📦 Ordered Products (${items.length} items)</h3>
              ${itemsTable}

              <!-- Financial Breakdown -->
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin-top: 20px;">
                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Subtotal:</td>
                    <td style="padding: 4px 0; color: #0f172a; text-align: right;">₹${subtotal}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #64748b;">Delivery / Shipping:</td>
                    <td style="padding: 4px 0; color: ${shipping === 0 ? '#16a34a' : '#0f172a'}; text-align: right; font-weight: ${shipping === 0 ? '700' : '400'};">${shipping === 0 ? 'FREE' : `₹${shipping}`}</td>
                  </tr>
                  ${discount > 0 ? `
                    <tr>
                      <td style="padding: 4px 0; color: #16a34a;">Discount:</td>
                      <td style="padding: 4px 0; color: #16a34a; text-align: right;">-₹${discount}</td>
                    </tr>
                  ` : ''}
                  <tr style="border-top: 1px solid #cbd5e1; font-weight: 700; font-size: 16px;">
                    <td style="padding: 8px 0 4px 0; color: #0f172a;">Total Received:</td>
                    <td style="padding: 8px 0 4px 0; color: #1e3a8a; text-align: right;">₹${total}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; color: #94a3b8; font-size: 12px;">Razorpay Payment ID:</td>
                    <td style="padding: 4px 0; color: #64748b; text-align: right; font-family: monospace; font-size: 12px;">${paymentId}</td>
                  </tr>
                </table>
              </div>

              <!-- Action Links -->
              <div style="margin-top: 24px; text-align: center; display: flex; justify-content: center; gap: 12px;">
                <a href="https://picklecart.in/admin/orders" style="display: inline-block; background-color: #1e3a8a; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 10px 22px; border-radius: 6px;">
                  Open Admin Orders Dashboard
                </a>
              </div>
            </div>

            <!-- Footer -->
            <div style="background-color: #f1f5f9; border-top: 1px solid #e2e8f0; padding: 14px 24px; text-align: center;">
              <p style="font-size: 11px; color: #64748b; margin: 0;">This is an automated notification from your PickleCart store.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend owner order notification error:", error);
    }
    return data;
  } catch (err) {
    console.error("Failed to send owner order notification:", err);
    return null;
  }
}
