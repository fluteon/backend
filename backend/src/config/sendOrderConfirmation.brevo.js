const axios = require("axios");
require("dotenv").config();
const logger = require("../utils/logger.js");

/**
 * Send Order Confirmation email via Brevo
 * @param {string} email  - recipient email
 * @param {object} info   - { name, orderId, amount, items, shippingAddress }
 */
const sendOrderConfirmationEmail = async (email, info) => {
    const { name, orderId, amount, items = [], shippingAddress = {} } = info;

    const itemsHtml = items.map(item => `
    <tr>
      <td style="padding:8px 12px; border-bottom:1px solid #eee;">
        ${item.product?.title || item.title || "Product"}
        ${item.size ? `<span style="color:#888; font-size:0.85em;"> (${item.size})</span>` : ""}
      </td>
      <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:center;">${item.quantity}</td>
      <td style="padding:8px 12px; border-bottom:1px solid #eee; text-align:right;">₹${item.discountedPrice}</td>
    </tr>
  `).join("");

    const shortOrderId = String(orderId).slice(-8).toUpperCase();
    const trackUrl = `${process.env.FRONTEND_URL || "https://www.fluteon.com"}/orders/${orderId}`;

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">
      <div style="text-align:center; margin-bottom: 24px;">
        <h1 style="color: #5c4dff; margin: 0;">Fluteon</h1>
        <p style="color: #888; margin: 4px 0;">Order Confirmation</p>
      </div>

      <h2 style="color: #1a1a1a;">Hi ${name},</h2>
      <p>🎉 Your order has been placed successfully! Here are the details:</p>

      <div style="background:#f9f9ff; border:1px solid #e0e0ff; border-radius:8px; padding:16px; margin:16px 0;">
        <p style="margin:4px 0;"><strong>Order ID:</strong> #${shortOrderId}</p>
        <p style="margin:4px 0;"><strong>Total Amount:</strong> ₹${amount}</p>
        <p style="margin:4px 0;"><strong>Delivery To:</strong> ${shippingAddress.streetAddress || ""}, ${shippingAddress.city || ""}, ${shippingAddress.state || ""} - ${shippingAddress.zipCode || ""}</p>
      </div>

      <h3 style="color: #5c4dff; border-bottom: 2px solid #f0f0ff; padding-bottom: 8px;">Items Ordered</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:16px;">
        <thead>
          <tr style="background:#5c4dff; color:white;">
            <th style="padding:8px 12px; text-align:left;">Item</th>
            <th style="padding:8px 12px; text-align:center;">Qty</th>
            <th style="padding:8px 12px; text-align:right;">Price</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
        <tfoot>
          <tr>
            <td colspan="2" style="padding:10px 12px; text-align:right; font-weight:bold;">Total:</td>
            <td style="padding:10px 12px; text-align:right; font-weight:bold; color:#5c4dff;">₹${amount}</td>
          </tr>
        </tfoot>
      </table>

      <div style="text-align:center; margin: 24px 0;">
        <a href="${trackUrl}"
           style="background:#5c4dff; color:white; padding:12px 28px; border-radius:6px; text-decoration:none; font-weight:bold; display:inline-block;">
          Track Your Order
        </a>
      </div>

      <p style="color:#888; font-size:0.9em;">
        You can track your order anytime using the link above or by visiting 
        <a href="${trackUrl}" style="color:#5c4dff;">${trackUrl}</a>
      </p>

      <hr style="margin:24px 0; border:none; border-top:1px solid #eee;">
      <p style="color:#aaa; font-size:0.85em; text-align:center;">
        If you have questions, just reply to this email.<br>
        — Team Fluteon
      </p>
    </div>
  `;

    try {
        await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: { name: "Fluteon", email: process.env.FROM_EMAIL },
                to: [{ email, name }],
                subject: `Order Confirmed! #${shortOrderId} — Fluteon`,
                htmlContent,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );
        logger.success(`Order confirmation email sent to ${email}`);
    } catch (err) {
        // Non-fatal — log but don't crash order creation
        logger.error("Order confirmation email failed:", err?.response?.data?.message || err.message);
    }
};

module.exports = { sendOrderConfirmationEmail };
