const axios = require("axios");
require("dotenv").config();

/**
 * Send OTP via WhatsApp using MSG91 WhatsApp Template API
 * Docs: https://docs.msg91.com/reference/whatsapp-outbound-message
 *
 * Template: "whatsappotp"
 * - body_1  → the OTP value
 * - button_1 → copy-code button value (same OTP)
 *
 * @param {string} mobile - 10-digit Indian mobile number (without country code)
 * @param {string} otp    - The OTP string to send
 */
const sendWhatsAppOtp = async (mobile, otp) => {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_TEMPLATE_ID;       // template name or ID
    const namespace = process.env.MSG91_TEMPLATE_NAMESPACE; // e.g. "2fc815e6_5447_4bfc_badf_97fbe88e551a"
    const integratedNum = process.env.MSG91_INTEGRATED_NUMBER;  // e.g. "919892550941"

    if (!authKey || !templateId || !namespace || !integratedNum) {
        console.error("❌ MSG91 credentials missing in .env");
        throw new Error("WhatsApp OTP service is not configured. Please contact support.");
    }

    // MSG91 expects country code prefixed mobile (91 for India)
    const mobileWithCode = `91${mobile}`;

    const payload = {
        integrated_number: integratedNum,
        content_type: "template",
        payload: {
            messaging_product: "whatsapp",
            type: "template",
            template: {
                name: templateId,
                language: {
                    code: "en",
                    policy: "deterministic",
                },
                namespace: namespace,
                to_and_components: [
                    {
                        to: [mobileWithCode],
                        components: {
                            body_1: {
                                type: "text",
                                value: otp,      // OTP shown in message body
                            },
                            button_1: {
                                subtype: "url",
                                type: "text",
                                value: otp,      // Copy-code button value
                            },
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
            {
                headers: {
                    authkey: authKey,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = response.data;
        console.log("✅ MSG91 WhatsApp OTP sent:", data);

        // MSG91 returns { type: "error", ... } on failure
        if (data?.type === "error") {
            throw new Error(data?.message || "Failed to send WhatsApp OTP");
        }

        return { success: true, message: "OTP sent via WhatsApp" };
    } catch (err) {
        const errMsg =
            err?.response?.data?.message ||
            err?.response?.data?.errors?.join(", ") ||
            err.message ||
            "Failed to send WhatsApp OTP";
        console.error("❌ MSG91 send error:", errMsg);
        throw new Error(errMsg);
    }
};

/**
 * Send Order Confirmation via WhatsApp using MSG91
 * Template variables:
 *   body_1 → customer name
 *   body_2 → order ID (short)
 *   body_3 → total amount (₹)
 *   body_4 → track order URL
 *
 * @param {string} mobile  - 10-digit Indian mobile (no country code)
 * @param {object} orderInfo - { name, orderId, amount, trackUrl }
 */
const sendWhatsAppOrderConfirmation = async (mobile, orderInfo) => {
    const authKey = process.env.MSG91_AUTH_KEY;
    const templateId = process.env.MSG91_ORDER_TEMPLATE_ID;       // new template name
    const namespace = process.env.MSG91_TEMPLATE_NAMESPACE;
    const integratedNum = process.env.MSG91_INTEGRATED_NUMBER;

    if (!authKey || !templateId || !namespace || !integratedNum) {
        console.warn("⚠️ MSG91 order template not configured — skipping WhatsApp notification");
        return;
    }

    const mobileWithCode = `91${mobile}`;
    const { name, orderId, amount, trackUrl } = orderInfo;

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
                            body_2: { type: "text", value: orderId },
                            body_3: { type: "text", value: String(amount) },
                            body_4: { type: "text", value: trackUrl },
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
        console.log("✅ WhatsApp order confirmation sent to", mobileWithCode);
    } catch (err) {
        // Non-fatal — log but don't crash order creation
        console.error("❌ WhatsApp order notification failed:", err?.response?.data?.message || err.message);
    }
};

module.exports = { sendWhatsAppOtp, sendWhatsAppOrderConfirmation };
