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

module.exports = { sendWhatsAppOtp };
