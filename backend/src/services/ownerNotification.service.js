const axios = require("axios");
require("dotenv").config();

/**
 * Send WhatsApp notification to the owner
 * Reusable function — just pass the template ID and body components
 *
 * @param {string} templateId - MSG91 template name (e.g. "new_partner_alert")
 * @param {object} components - Body components like { body_1: { type: "text", value: "..." }, ... }
 */
const sendOwnerWhatsApp = async (templateId, components) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const namespace = process.env.MSG91_TEMPLATE_NAMESPACE;
  const integratedNum = process.env.MSG91_INTEGRATED_NUMBER;
  const ownerPhone = process.env.OWNER_WHATSAPP;

  if (!authKey || !templateId || !namespace || !integratedNum || !ownerPhone) {
    console.warn("⚠️ Owner WhatsApp not fully configured — skipping");
    return;
  }

  const payload = {
    integrated_number: integratedNum,
    content_type: "template",
    payload: {
      messaging_product: "whatsapp",
      type: "template",
      template: {
        name: templateId,
        language: { code: "en", policy: "deterministic" },
        namespace: namespace,
        to_and_components: [
          {
            to: [ownerPhone],
            components,
          },
        ],
      },
    },
  };

  try {
    const response = await axios.post(
      "https://api.msg91.com/api/v5/whatsapp/whatsapp-outbound-message/bulk/",
      payload,
      { headers: { authkey: authKey, "Content-Type": "application/json" } }
    );
    const data = response.data;
    if (data?.type === "error") throw new Error(data?.message || "MSG91 error");
    console.log(`✅ Owner WhatsApp alert sent (${templateId})`);
  } catch (err) {
    console.error(
      `❌ Owner WhatsApp alert failed (${templateId}):`,
      err?.response?.data?.message || err.message
    );
  }
};

/**
 * Notify owner about a new partner application
 */
const notifyOwnerNewPartner = async (partner) => {
  const templateId = process.env.MSG91_PARTNER_ALERT_TEMPLATE_ID;
  if (!templateId) {
    console.warn("⚠️ MSG91_PARTNER_ALERT_TEMPLATE_ID not set — skipping owner alert");
    return;
  }

  await sendOwnerWhatsApp(templateId, {
    body_1: { type: "text", value: partner.name },
    body_2: { type: "text", value: partner.phone },
    body_3: { type: "text", value: partner.email },
    body_4: { type: "text", value: partner.city },
  });
};

/**
 * Notify owner about a new order
 */
const notifyOwnerNewOrder = async (order) => {
  const templateId = process.env.MSG91_ORDER_ALERT_TEMPLATE_ID;
  if (!templateId) {
    console.warn("⚠️ MSG91_ORDER_ALERT_TEMPLATE_ID not set — skipping owner alert");
    return;
  }

  const orderId = String(order._id).slice(-8).toUpperCase();
  const customerName =
    order.user?.firstName
      ? `${order.user.firstName} ${order.user.lastName || ""}`
      : order.shippingAddress?.firstName || "Guest";
  const amount = String(order.totalDiscountedPrice || order.totalPrice || "0");
  const itemCount = String(order.totalItem || order.orderItems?.length || 0);

  await sendOwnerWhatsApp(templateId, {
    body_1: { type: "text", value: orderId },
    body_2: { type: "text", value: customerName.trim() },
    body_3: { type: "text", value: amount },
    body_4: { type: "text", value: `${itemCount} item(s)` },
  });
};

module.exports = { sendOwnerWhatsApp, notifyOwnerNewPartner, notifyOwnerNewOrder };
