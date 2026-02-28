const Order = require("../models/order.model.js");
const OrderItem = require("../models/orderItems.js");
const Product = require("../models/product.model.js");
const { sendWhatsAppOrderConfirmation } = require("../services/whatsapp.service.js");
const { sendOrderConfirmationEmail } = require("../config/sendOrderConfirmation.brevo.js");

/**
 * POST /api/guest-orders
 * Body: { guestInfo: { name, email, phone }, shippingAddress: {...}, items: [{ productId, size, quantity }] }
 * No authentication required.
 */
const createGuestOrder = async (req, res) => {
    try {
        const { guestInfo, shippingAddress, items } = req.body;

        if (!guestInfo?.name || !guestInfo?.email || !guestInfo?.phone) {
            return res.status(400).json({ message: "Guest name, email, and phone are required." });
        }
        if (!shippingAddress?.streetAddress || !shippingAddress?.city || !shippingAddress?.state) {
            return res.status(400).json({ message: "Complete shipping address is required." });
        }
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No items in order." });
        }

        // Build order items from products
        const orderItems = [];
        let totalPrice = 0;
        let totalDiscountedPrice = 0;
        let totalItem = 0;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.productId}` });
            }

            const qty = item.quantity || 1;
            const price = product.price * qty;
            const discountedPrice = product.discountedPrice * qty;

            const orderItem = new OrderItem({
                price: product.price,
                product: product._id,
                quantity: qty,
                size: item.size,
                discountedPrice: product.discountedPrice,
            });
            const savedItem = await orderItem.save();
            orderItems.push(savedItem._id);

            totalPrice += price;
            totalDiscountedPrice += discountedPrice;
            totalItem += qty;
        }

        const discounte = totalPrice - totalDiscountedPrice;

        // Inline shipping address for guest (not saved separately)
        const order = new Order({
            user: null,
            isGuestOrder: true,
            guestInfo: {
                name: guestInfo.name,
                email: guestInfo.email,
                phone: guestInfo.phone,
            },
            orderItems,
            shippingAddress: {
                firstName: shippingAddress.firstName || guestInfo.name.split(" ")[0] || "",
                lastName: shippingAddress.lastName || guestInfo.name.split(" ").slice(1).join(" ") || "",
                streetAddress: shippingAddress.streetAddress,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zipCode || "",
                mobile: shippingAddress.mobile || guestInfo.phone,
            },
            totalPrice,
            totalDiscountedPrice,
            discounte,
            totalItem,
            orderDate: new Date(),
            orderStatus: "PENDING",
            paymentDetails: { paymentStatus: "PENDING" },
            createdAt: new Date(),
        });

        const savedOrder = await order.save();

        // Populate product details for response
        const populated = await Order.findById(savedOrder._id)
            .populate({ path: "orderItems", populate: { path: "product" } });

        // ── Fire notifications (non-blocking) ──────────────────────────────
        const phone10 = (guestInfo.phone || "").replace(/^\+?91/, "").trim();
        const frontendUrl = process.env.FRONTEND_URL || "https://www.fluteon.com";
        const trackUrl = `${frontendUrl}/track-order?id=${savedOrder._id}`;

        const notifInfo = {
            name: guestInfo.name,
            orderId: String(savedOrder._id),
            amount: totalDiscountedPrice,
            trackUrl,
            items: populated?.orderItems || [],
            shippingAddress,
        };

        Promise.allSettled([
            phone10.length === 10
                ? sendWhatsAppOrderConfirmation(phone10, notifInfo)
                : Promise.resolve(),
            sendOrderConfirmationEmail(guestInfo.email, notifInfo),
        ]).then(results => {
            results.forEach((r, i) => {
                if (r.status === "rejected") {
                    console.error(`❌ Notification ${i === 0 ? "WhatsApp" : "Email"} failed:`, r.reason);
                }
            });
        });
        // ─────────────────────────────────────────────────

        return res.status(201).json(populated);
    } catch (error) {
        console.error("❌ Guest order creation error:", error.message);
        return res.status(500).json({ message: error.message });
    }
};

/**
 * GET /api/guest-orders/:id
 * Returns order by ID (no auth required — guest links via email usually)
 */
const getGuestOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate({ path: "orderItems", populate: { path: "product" } });
        if (!order) return res.status(404).json({ message: "Order not found" });
        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = { createGuestOrder, getGuestOrder };
