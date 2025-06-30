const express=require("express");

const router=express.Router();
const authController=require("../controllers/auth.controller.js")
const {verifyEmailService, confirmOtpService,sendResetOtpService, resetPasswordService} =require("../services/user.service.js")



router.post("/signup",authController.register)
router.post("/signin",authController.login)


router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;
    const result = await verifyEmailService(email);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await confirmOtpService(email, otp);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/send-reset-otp", async (req, res) => {
  try {
    const response = await sendResetOtpService(req.body.email);
    res.json(response);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const response = await resetPasswordService(email, newPassword);
    res.json(response);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});


module.exports=router;