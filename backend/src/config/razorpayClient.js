const Razorpay = require('razorpay');
require("dotenv").config();
apiKey=process.env.Razor_Pay_key_Id
apiSecret=process.env.Razor_Pay_Secret_key

const razorpay = new Razorpay({
    key_id: apiKey,
    key_secret: apiSecret,
  });


  module.exports=razorpay;