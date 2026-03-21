const userService = require("../services/user.service.js");
const jwtProvider = require("../config/jwtProvider.js");
const bcrypt = require("bcrypt");
const cartService = require("../services/cart.service.js");
const { sanitizeError, errorMessages } = require("../utils/errorHandler.js");

const register = async (req, res) => {
  try {
    const { emailVerified, mobileVerified, mobile } = req.body;

    // At least ONE of email or mobile must be verified
    if (!emailVerified && !mobileVerified) {
      return res.status(400).send({
        message: "Please verify your email or mobile number before registration"
      });
    }

    // Build userData passing the mobile number verbatim if provided
    const userData = { ...req.body };

    const user = await userService.createUser(userData);
    const jwt = jwtProvider.generateToken(user._id);

    await cartService.createCart(user);

    return res.status(200).send({ jwt, message: "Registration successful" });
  } catch (error) {
    const safeMessage = sanitizeError(error, errorMessages.auth.register);
    return res.status(500).send({ message: safeMessage });
  }
};

const login = async (req, res) => {
  const { password, email, identifier, googleAuth } = req.body;

  // identifier handles either email or mobile from the unified login input
  const loginIdentifier = identifier || email;

  try {
    let user;

    // Handle Google Authentication for Admin
    if (googleAuth) {
      const ALLOWED_ADMIN_EMAIL = 'fluteoncompany@gmail.com';
      if (loginIdentifier !== ALLOWED_ADMIN_EMAIL) {
        return res.status(403).json({
          message: `Access Denied: Only ${ALLOWED_ADMIN_EMAIL} is authorized for admin access`
        });
      }

      user = await userService.getUserByEmail(loginIdentifier);

      if (!user) {
        const { firstName, lastName } = req.body;
        user = await userService.createUser({
          email: loginIdentifier,
          password: password,
          firstName: firstName || 'Admin',
          lastName: lastName || '',
          role: 'ADMIN'
        });
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid Google account" });
        }
      }

      const jwt = jwtProvider.generateToken(user._id);
      return res.status(200).send({ jwt, message: "Admin login success" });
    }

    // Login with Email or Mobile
    if (!loginIdentifier) {
      return res.status(400).json({ message: "Email or Mobile Number is required" });
    }

    user = await userService.getUserByIdentifier(loginIdentifier);

    if (!user) {
      return res.status(401).json({ message: errorMessages.auth.login });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: errorMessages.auth.login });
    }

    const jwt = jwtProvider.generateToken(user._id);

    return res.status(200).send({ jwt, message: "Login successful" });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send({ message: error.message || errorMessages.auth.login });
  }
};

const loginWithOtp = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile || !otp) {
      return res.status(400).json({ message: "Mobile and OTP are required" });
    }

    // This will throw if invalid or expired
    await userService.verifyWhatsAppOtpService(mobile, otp);

    const user = await userService.getUserByIdentifier(mobile);
    if (!user) {
      return res.status(404).json({ message: "User not found with this mobile number. Please register." });
    }

    const jwt = jwtProvider.generateToken(user._id);
    return res.status(200).send({ jwt, message: "OTP Login successful" });
  } catch (error) {
    const safeMessage = sanitizeError(error, "Failed to login with OTP.");
    return res.status(400).send({ message: safeMessage });
  }
};

const sendLoginOtp = async (req, res) => {
  try {
    const { identifier } = req.body;
    if (!identifier) {
      return res.status(400).json({ message: "Identifier (Email or Mobile) is required" });
    }

    const response = await userService.sendLoginOtpService(identifier);
    return res.status(200).json(response);
  } catch (error) {
    const safeMessage = sanitizeError(error, "Failed to send login OTP.");
    return res.status(400).send({ message: safeMessage });
  }
};

module.exports = { register, login, loginWithOtp, sendLoginOtp };
