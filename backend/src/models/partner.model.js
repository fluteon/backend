const mongoose = require("mongoose");

const partnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    city: {
      type: String,
      required: [true, "City / State is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "approved", "rejected"],
      default: "new",
    },
    ipAddress: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt
  }
);

// Index for duplicate check queries and search
partnerSchema.index({ phone: 1, createdAt: -1 });
partnerSchema.index({ email: 1, createdAt: -1 });

const Partner = mongoose.model("Partner", partnerSchema);

module.exports = Partner;
