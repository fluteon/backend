const Partner = require("../models/partner.model.js");
const {
  sendPartnerConfirmationEmail,
  sendPartnerWhatsApp,
} = require("../config/partnerNotification.js");
const { notifyOwnerNewPartner } = require("../services/ownerNotification.service.js");

/**
 * POST /api/partners
 * Public — submit a partner application
 */
const createPartner = async (req, res) => {
  try {
    const { name, phone, email, city } = req.body;

    // ── Basic validation ─────────────────────────────────
    if (!name || !phone || !email || !city) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address." });
    }

    const phoneRegex = /^[6-9]\d{9}$/;
    const cleanPhone = phone.replace(/^\+?91/, "").replace(/\s/g, "").trim();
    if (!phoneRegex.test(cleanPhone)) {
      return res
        .status(400)
        .json({ message: "Invalid Indian phone number." });
    }

    // ── Duplicate check (same phone or email within 7 days) ──
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const duplicate = await Partner.findOne({
      $or: [{ phone: cleanPhone }, { email: email.toLowerCase() }],
      createdAt: { $gte: sevenDaysAgo },
    });

    if (duplicate) {
      return res.status(409).json({
        message:
          "An application with this phone or email was already submitted recently. Please wait before re-applying.",
      });
    }

    // ── Get client IP ────────────────────────────────────
    const ipAddress =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket?.remoteAddress ||
      "";

    // ── Save partner ─────────────────────────────────────
    const partner = new Partner({
      name: name.trim(),
      phone: cleanPhone,
      email: email.toLowerCase().trim(),
      city: city.trim(),
      ipAddress,
    });

    const saved = await partner.save();

    // ── Fire notifications (non-blocking) ────────────────
    console.log("📧 Sending partner notifications to:", saved.email, saved.phone);
    console.log("📧 FROM_EMAIL:", process.env.FROM_EMAIL);
    console.log("📧 BREVO_API_KEY set:", !!process.env.BREVO_API_KEY);
    console.log("📱 MSG91_PARTNER_TEMPLATE_ID:", process.env.MSG91_PARTNER_TEMPLATE_ID);

    Promise.allSettled([
      sendPartnerConfirmationEmail(saved.email, saved.name),
      sendPartnerWhatsApp(saved.phone, saved.name),
      notifyOwnerNewPartner(saved),
    ]).then((results) => {
      const labels = ["Email", "WhatsApp", "Owner Alert"];
      results.forEach((r, i) => {
        const label = labels[i];
        if (r.status === "fulfilled") {
          console.log(`✅ Partner ${label} notification completed successfully`);
        } else {
          console.error(
            `❌ Partner ${label} notification failed:`,
            r.reason?.response?.data || r.reason?.message || r.reason
          );
        }
      });
    });

    return res.status(201).json({
      message:
        "Thank you! Your partner application has been submitted. We will contact you soon.",
      partnerId: saved._id,
    });
  } catch (error) {
    console.error("❌ Partner creation error:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

/**
 * GET /api/partners?page=1&pageSize=10&search=term
 * Admin — list all partner applications with pagination + search
 */
const getAllPartners = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const search = req.query.search || "";
    const skip = (page - 1) * pageSize;

    const filter = {};
    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { phone: regex }, { email: regex }];
    }

    const [partners, total] = await Promise.all([
      Partner.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)
        .lean(),
      Partner.countDocuments(filter),
    ]);

    return res.status(200).json({
      content: partners,
      currentPage: page,
      totalPages: Math.ceil(total / pageSize),
      totalPartners: total,
    });
  } catch (error) {
    console.error("❌ Error fetching partners:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

/**
 * PUT /api/partners/:id/status
 * Admin — update status (mark as contacted, approved, etc.)
 */
const updatePartnerStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["new", "contacted", "approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!partner) {
      return res.status(404).json({ message: "Partner not found." });
    }
    return res.status(200).json(partner);
  } catch (error) {
    console.error("❌ Error updating partner status:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

/**
 * DELETE /api/partners/:id
 * Admin — delete a partner application
 */
const deletePartner = async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found." });
    }
    return res
      .status(200)
      .json({ message: "Partner application deleted.", success: true });
  } catch (error) {
    console.error("❌ Error deleting partner:", error.message);
    return res.status(500).json({ message: "Something went wrong." });
  }
};

module.exports = {
  createPartner,
  getAllPartners,
  updatePartnerStatus,
  deletePartner,
};
