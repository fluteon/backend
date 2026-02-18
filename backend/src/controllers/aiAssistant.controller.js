const orderService = require("../services/order.service");
const productService = require("../services/product.service");
const userService = require("../services/user.service");
// const { geminiChat } = require("../services/gemini.service"); // Optional AI fallback

const aiChatAssistant = async (req, res) => {
  const message = req.body.message?.toLowerCase() || "";
  const user = req.user;

  try {
    // ✅ Latest Order
    if (message.includes("latest order")) {
      const orders = await orderService.usersOrderHistory(user._id);
      if (!orders || orders.length === 0) {
        return res.json({ reply: "You haven't placed any orders yet." });
      }
      const latest = orders[0];
      const itemName = latest?.orderItems?.[0]?.name || "item";
      return res.json({
        reply: `🧾 Your latest order is for ${itemName} on ${new Date(latest.createdAt).toDateString()}. Total: ₹${latest.totalPrice}. Status: ${latest.orderStatus}.`,
      });
    }

    // ✅ Super Coins
    if (message.includes("super coin")) {
      return res.json({ reply: `💰 You have ${user.superCoins || 0} Super Coins available.` });
    }

    // ✅ Price of product
    if (message.includes("price of")) {
      const query = message.replace("price of", "").trim();
      const products = await productService.searchProducts(query);
      if (products.length === 0) {
        return res.json({ reply: `No product found matching "${query}".` });
      }
      return res.json({
        reply: `🛍️ The price of "${products[0].name}" is ₹${products[0].price}.`,
      });
    }

    // ✅ General friendly questions
    if (message.includes("how are you")) {
      return res.json({ reply: "I'm great! Thanks for asking 😊. How can I help you today?" });
    }

    if (message.includes("who are you")) {
      return res.json({ reply: "I'm Fluteon's virtual assistant 🤖, here to help you with orders, products, coins and more!" });
    }

    if (message.includes("joke")) {
      return res.json({ reply: "Why don’t developers wear glasses? Because they see sharp! 😄" });
    }

    // ⛔ Optional fallback to Gemini/OpenAI (can set up later)
    // const aiReply = await geminiChat(message);
    // return res.json({ reply: aiReply });

    return res.json({
      reply: "Hi! 👋 I can help with product details, order status, super coins, and payments. Try asking 'show my latest order' or 'price of cotton kurti'.",
    });
  } catch (error) {
    console.error("AI Assistant error:", error.message);
    return res.status(500).json({ reply: "Something went wrong while processing your request." });
  }
};

module.exports = { aiChatAssistant };
