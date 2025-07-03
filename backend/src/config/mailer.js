const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,         // smtp-relay.brevo.com
  port: process.env.BREVO_PORT,         // 587
  secure: false,                        // Use TLS (false for port 587)
  auth: {
    user: process.env.BREVO_USER,       // your Brevo SMTP user (like: 90d66xxx@smtp-brevo.com)
    pass: process.env.BREVO_PASS,       // your Brevo SMTP key/password
  },
});

async function sendOrderConfirmationEmail(to, order) {
  const itemsList = order.orderItems
    .map(
      (item) =>
        `<li>${item.product.title} - Qty: ${item.quantity}, Price: ₹${item.product.price}</li>`
    )
    .join("");

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #5c4dff;">🎉 Thank You for Your Order at <span style="color: #FF4C60;">Fluteon</span>, ${order.user.firstName}!</h2>
      <p>We’re excited to let you know that we’ve received your order and it’s now being processed.</p>

      <h3>🧾 Order Summary</h3>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>Status:</strong> ${order.orderStatus}</p>
      <p><strong>Placed on:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
      <p><strong>Total Price:</strong> ₹${order.totalPrice}</p>
      <p><strong>Discounted Price:</strong> ₹${order.totalDiscountedPrice}</p>

      <h3>📦 Shipping Address</h3>
      <p>
        ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br/>
        ${order.shippingAddress.streetAddress},<br/>
        ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}
      </p>

      <h3>🛍️ Items Ordered</h3>
      <ul>${itemsList}</ul>

      <hr/>
      <p style="font-size: 0.9em; color: #777;">You’ll receive another email once your order is shipped.</p>
      <p style="color: #aaa;">– Team Fluteon</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Fluteon" <fluteoncompany@fluteon.com>',  // ✅ Use your business sender
      to,
      subject: "🎉 Order Confirmation - Fluteon",
      html: htmlContent,
    });

    console.log("✅ Brevo Order Email sent:", info.messageId || info.response);
  } catch (err) {
    console.error("❌ Failed to send Brevo order email:", err.message);
  }
}

module.exports = { sendOrderConfirmationEmail };
