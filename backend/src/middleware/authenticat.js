
const jwtProvider = require("../config/jwtProvider");
const userService = require("../services/user.service");

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token not found" });
    }

    const token = authHeader.split(" ")[1];
    const userId = jwtProvider.getUserIdFromToken(token);
    const user = await userService.findUserById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = user;
    next(); // ✅ Allow next middleware
  } catch (error) {
    return res.status(500).json({ message: "Authentication failed", error: error.message });
  }
};

module.exports = authenticate;
