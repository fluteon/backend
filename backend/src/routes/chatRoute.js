const express = require("express");
const { aiChatAssistant } = require("../controllers/aiAssistant.controller"); // ✅ Correct file & function name
const authenticate = require("../middleware/authenticat");

const router = express.Router();

router.post("/chat", authenticate, aiChatAssistant); // ✅ Using correct function

module.exports = router;
