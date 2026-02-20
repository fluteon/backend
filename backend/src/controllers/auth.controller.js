const userService = require("../services/user.service.js");
const jwtProvider = require("../config/jwtProvider.js");
const bcrypt = require("bcrypt");
const cartService = require("../services/cart.service.js");
const { sanitizeError, errorMessages } = require("../utils/errorHandler.js");

const register = async (req, res) => {
  try {
    const { emailVerified } = req.body;
    
    // Ensure email is verified before registration
    if (!emailVerified) {
      return res.status(400).send({ 
        message: "Please verify your email before registration" 
      });
    }
    
    const user = await userService.createUser(req.body);
    const jwt = jwtProvider.generateToken(user._id);

    await cartService.createCart(user);

    return res.status(200).send({ jwt, message: "Registration successful" });
  } catch (error) {
    const safeMessage = sanitizeError(error, errorMessages.auth.register);
    return res.status(500).send({ message: safeMessage });
  }
};

const login = async (req, res) => {
  const { password, email, googleAuth } = req.body;
  
  try {
    let user;
    
    // Handle Google Authentication for Admin
    if (googleAuth) {
      const ALLOWED_ADMIN_EMAIL = 'fluteoncompany@gmail.com';
      if (email !== ALLOWED_ADMIN_EMAIL) {
        return res.status(403).json({ 
          message: `Access Denied: Only ${ALLOWED_ADMIN_EMAIL} is authorized for admin access` 
        });
      }

      user = await userService.getUserByEmail(email);
      
      if (!user) {
        const { firstName, lastName } = req.body;
        user = await userService.createUser({
          email,
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

    // Login with email
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    
    user = await userService.getUserByEmail(email);

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

module.exports = { register, login };
