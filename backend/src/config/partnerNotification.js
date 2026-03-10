const axios = require("axios");
require("dotenv").config();
const logger = require("../utils/logger.js");

/**
 * Send partner confirmation email via Brevo
 */
const sendPartnerConfirmationEmail = async (email, name) => {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; color: #333;">
      <div style="text-align:center; margin-bottom: 24px;">
        <h1 style="color: #5c4dff; margin: 0;">Fluteon</h1>
        <p style="color: #888; margin: 4px 0;">Partner Application Received</p>
      </div>

      <h2 style="color: #1a1a1a;">Hi ${name},</h2>
      <p>Thank you for applying to become a <strong>Fluteon Partner</strong>! 🎉</p>

      <div style="background:#f9f9ff; border:1px solid #e0e0ff; border-radius:8px; padding:16px; margin:16px 0;">
        <p style="margin:4px 0;">We have received your application and our team will review it shortly.</p>
        <p style="margin:4px 0;">We will contact you soon with the next steps.</p>
      </div>

      <p style="color:#888; font-size:0.9em;">
        If you have any questions, feel free to reply to this email.
      </p>

      <hr style="margin:24px 0; border:none; border-top:1px solid #eee;">
      <p style="color:#aaa; font-size:0.85em; text-align:center;">
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
        subject: "Partner Application Received — Fluteon",
        htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    logger.success(`Partner confirmation email sent to ${email}`);
  } catch (err) {
    logger.error(
      "Partner email failed:",
      err?.response?.data?.message || err.message
    );
  }
};

/**
 * Send partner confirmation WhatsApp via MSG91
 * Uses the order template with a simple thank-you message.
 * If no partner-specific template is configured, this gracefully skips.
 */
const sendPartnerWhatsApp = async (phone, name) => {
  const authKey = process.env.MSG91_AUTH_KEY;
  const templateId = process.env.MSG91_PARTNER_TEMPLATE_ID;
  const namespace = process.env.MSG91_TEMPLATE_NAMESPACE;
  const integratedNum = process.env.MSG91_INTEGRATED_NUMBER;

  if (!authKey || !templateId || !namespace || !integratedNum) {
    console.warn(
      "⚠️ MSG91 partner template not configured — skipping WhatsApp notification"
    );
    return;
  }

  const phone10 = phone.replace(/^\+?91/, "").trim();
  const mobileWithCode = `91${phone10}`;

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
            to: [mobileWithCode],
            components: {
              body_1: { type: "text", value: name },
            },
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
    console.log("✅ Partner WhatsApp sent to", mobileWithCode);
  } catch (err) {
    console.error(
      "❌ Partner WhatsApp failed:",
      err?.response?.data?.message || err.message
    );
  }
};

module.exports = { sendPartnerConfirmationEmail, sendPartnerWhatsApp };
