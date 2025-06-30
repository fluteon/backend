const Razorpay = require('razorpay');

apiKey="rzp_test_SaVJ3xR8JmJyuF"
apiSecret="GEXst0p50woTKsKevOqjDZlW"

const razorpay = new Razorpay({
    key_id: apiKey,
    key_secret: apiSecret,
  });


  module.exports=razorpay;