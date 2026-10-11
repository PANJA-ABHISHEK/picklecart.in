import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderConfirmationEmail(orderId, customerEmail, customerName, total) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("Resend API key missing, skipping email.");
    return;
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'PickleCart <onboarding@resend.dev>', // Using testing domain provided by Resend
      to: [customerEmail],
      subject: `Order Confirmation - PickleCart #${orderId}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
          <h2 style="color: #b43d2c; text-align: center;">Order Confirmed!</h2>
          <p>Hi ${customerName},</p>
          <p>Thank you for your order. We are preparing your traditional flavors!</p>
          
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Order ID:</strong> #${orderId}</p>
            <p style="margin: 5px 0 0 0;"><strong>Total Amount:</strong> ₹${total}</p>
          </div>
          
          <p>You can track your order status on our website using your Order ID.</p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
          <p style="font-size: 12px; color: #6b7280; text-align: center;">PickleCart - Fill Your Cart with Tradition</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
    }
    return data;
  } catch (err) {
    console.error("Failed to send email:", err);
  }
}
