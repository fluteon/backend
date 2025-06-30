const axios = require("axios");
require("dotenv").config();

const sendEmailViaBrevo = async (email, otp) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "Fluteon",
          email: process.env.FROM_EMAIL,
        },
        to: [{ email }], // ✅ dynamically sent to any user email
        subject: "Your OTP for Fluteon Account Verification",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #5c4dff;">Welcome to Fluteon!</h2>
            <p>Thank you for using our platform. Please use the OTP below to verify your email address:</p>
            <h1 style="letter-spacing: 5px; background: #f0f0f0; padding: 10px 20px; display: inline-block; border-radius: 5px;">
              ${otp}
            </h1>
            <p style="margin-top: 20px;">⚠️ <strong>Do not share this OTP</strong> with anyone. It will expire in <strong>10 minutes</strong>.</p>
            <hr style="margin: 20px 0;">
            <p style="font-size: 0.9em; color: #777;">If you did not request this OTP, please ignore this email.</p>
            <p style="color: #aaa;">— Team Fluteon</p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ OTP email sent to", email);
  } catch (err) {
    console.error("❌ Failed to send email to", email, err.response?.data || err.message);
    throw new Error("Failed to send email");
  }
};

module.exports = sendEmailViaBrevo;
