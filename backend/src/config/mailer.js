// // utils/mailer.js
// require("dotenv").config();
// const nodemailer = require("nodemailer");

// const transporter = nodemailer.createTransport({
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   auth: {
//     user: process.env.BREVO_USR_EMAIL,
//     pass: process.env.BREVIO_SMTP_KEY_VALUE,
//   },
// });

// async function sendOrderConfirmationEmail(to, order) {
//   const itemsList = order.orderItems
//     .map(
//       (item) =>
//         `<tr>
//           <td style="padding: 8px 0;">${item.product.title}</td>
//           <td style="padding: 8px 0;">${item.quantity}</td>
//           <td style="padding: 8px 0;">₹${item.product.price}</td>
//         </tr>`
//     )
//     .join("");

//   const htmlContent = `
//   <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: #ffffff; border: 1px solid #e0e0e0;">
//     <h2 style="color: #4CAF50;">🎉 Thank You for Your Order, ${order.user.firstName}! 🎉</h2>
//     <p style="font-size: 16px;">We’re happy to let you know that your order has been placed successfully. Here are your order details:</p>
    
//     <hr style="margin: 20px 0;" />
    
//     <h3 style="color: #333;">🧾 Order Summary</h3>
//     <p><strong>Order ID:</strong> ${order._id}</p>
//     <p><strong>Status:</strong> ${order.orderStatus}</p>
//     <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
    
//     <h3 style="margin-top: 20px;">📍 Shipping Address</h3>
//     <p>
//       ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}<br/>
//       ${order.shippingAddress.streetAddress},<br/>
//       ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}
//     </p>

//     <h3 style="margin-top: 20px;">🛒 Items Ordered</h3>
//     <table width="100%" style="border-collapse: collapse;">
//       <thead>
//         <tr style="background-color: #f5f5f5;">
//           <th align="left" style="padding: 10px;">Product</th>
//           <th align="left" style="padding: 10px;">Qty</th>
//           <th align="left" style="padding: 10px;">Price</th>
//         </tr>
//       </thead>
//       <tbody>${itemsList}</tbody>
//     </table>

//     <h3 style="margin-top: 20px;">💰 Payment</h3>
//     <p><strong>Total Price:</strong> ₹${order.totalPrice}</p>
//     <p><strong>Discounted Price:</strong> ₹${order.totalDiscountedPrice}</p>

//     <hr style="margin: 30px 0;" />

//     <p style="font-size: 16px;">Congratulations again, and thank you for choosing <strong>Fluteon</strong>! 💚</p>
//     <p style="font-size: 14px;">If you have any questions about your order, reply to this email and we’ll be happy to help.</p>
    
//     <p style="margin-top: 30px; font-size: 14px; color: #777;">&copy; ${new Date().getFullYear()} Fluteon. All rights reserved.</p>
//   </div>
// `;

//   try {
//     const info = await transporter.sendMail({
//       from: `"Fluteon" <${process.env.BREVO_USR_EMAIL}>`,
//       to,
//       subject: "🎉 Order Confirmed! | Fluteon",
//       html: htmlContent,
//     });
//     console.log("✅ Email sent successfully:", info.messageId || info.response);
//   } catch (err) {
//     console.error("❌ Failed to send email:", err.message);
//   }
// }

// module.exports = { sendOrderConfirmationEmail };
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
