// const paymentService=require("../services/payment.service.js")

// const createPaymentLink=async(req,res)=>{

//     try {
//         const paymentLink=await paymentService.createPaymentLink(req.params.id);
//         return res.status(200).send(paymentLink)
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }

// }

// const updatePaymentInformation=async(req,res)=>{

//     try {
//         await paymentService.updatePaymentInformation(req.query)
//         return res.status(200).send({message:"payment information updated",status:true})
//     } catch (error) {
//         return res.status(500).send(error.message);
//     }

// }

// module.exports={createPaymentLink,updatePaymentInformation}

const paymentService=require("../services/payment.service.js")
const PaymentInformation = require("../models/payment.information.js");

// controllers/payment.controller.js
const createPaymentLink = async (req, res) => {
  try {
    const usedSuperCoins = req.body.usedSuperCoins || 0;
    const couponDiscount = req.body.couponDiscount || 0;
    const paymentMethod = req.body.paymentMethod; // Check if COD

    // ✅ Handle COD separately
    if (paymentMethod === "COD") {
      const codResult = await paymentService.createCODOrder(req.params.id, usedSuperCoins, couponDiscount);
      return res.status(200).json(codResult);
    }

    // ✅ Handle online payment (Razorpay)
    const paymentLink = await paymentService.createPaymentLink(req.params.id, usedSuperCoins, couponDiscount);
    return res.status(200).json(paymentLink);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const updatePaymentInformation = async (req, res) => {
  try {
    const result = await paymentService.updatePaymentInformation(req.query); // Pass payment_id and order_id
    return res.status(200).send({
      message: "Payment information updated",
      status: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Failed to update payment information",
      error: error.message,
      status: false,
    });
  }
};


// ✅ controllers/payment.controller.js
const getUserPaymentHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orderId = req.query.orderId || null;

    const history = await paymentService.getUserPaymentHistory(userId, orderId); // 👈 correct
    return res.status(200).json(history);
  } catch (error) {
    console.error("Payment history controller error:", error);
    return res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createPaymentLink,
  updatePaymentInformation,
  getUserPaymentHistory,
};
