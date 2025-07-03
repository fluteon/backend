const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_HOST,
  port: process.env.BREVO_PORT,
  secure: false,
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASS,
  },
});

async function sendUserQueryConfirmationEmail(to, name, message) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #5c4dff;">Hi ${name},</h2>
      <p>Thank you for reaching out to <span style="color: #FF4C60;">Fluteon</span>! 🎉</p>

      <h3>📝 Query Summary</h3>
      <p><strong>Your Message:</strong></p>
      <blockquote style="border-left: 4px solid #ccc; padding-left: 12px; color: #555;">
        ${message}
      </blockquote>

      <p>We’ve received your query and our support team will get in touch with you shortly.</p>

      <hr style="margin: 20px 0;" />
      <p style="font-size: 0.9em; color: #777;">In the meantime, feel free to explore our website or reply to this email if you have more information to share.</p>
      <p style="color: #aaa;">– Team Fluteon</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: '"Fluteon Support" <fluteoncompany@fluteon.com>',
      to,
      subject: "🤝 We've received your query - Fluteon",
      html: htmlContent,
    });

    console.log("✅ Query confirmation email sent to user:", info.messageId || info.response);
  } catch (err) {
    console.error("❌ Failed to send query confirmation email:", err.message);
  }
}

module.exports = { sendUserQueryConfirmationEmail };
