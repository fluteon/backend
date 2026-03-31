
const orderService = require("../services/order.service");
const cloudinary = require("../config/cloudinary");




// const getAllOrders = async (req, res) => {
//   try {
//     const page = parseInt(req.query.page) || 1;
//     const pageSize = parseInt(req.query.pageSize) || 10;

//     const result = await orderService.getAllOrders(page, pageSize);

//     return res.status(200).send(result);
//   } catch (error) {
//     console.error("Admin Order Fetch Error:", error.message);
//     res.status(500).send({ error: "Something went wrong" });
//   }
// };

const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const status = req.query.status || ""; // ✅ filter param
    const sort = req.query.sort || "Newest"; // ✅ sort param

    const result = await orderService.getAllOrders(page, pageSize, status, sort);

    return res.status(200).send(result);
  } catch (error) {
    console.error("Admin Order Fetch Error:", error.message);
    res.status(500).send({ error: "Something went wrong" });
  }
};




const confirmedOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.confirmedOrder(orderId);
    res.status(202).json(order);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const shippOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.shipOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};
const outForDelivery = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.outForDelivery(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const deliverOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.deliveredOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const cancelledOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const order = await orderService.cancelledOrder(orderId);
    return res.status(202).send(order);
  } catch (error) {
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    await orderService.deleteOrder(orderId);
    res
      .status(202)
      .json({ message: "Order Deleted Successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

const returnOrder = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { reason, description } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploadPromises = req.files.map((file) =>
        cloudinary.uploader.upload_stream(
          {
            folder: "returns", // you can name this folder as needed
            resource_type: "image",
          },
          (error, result) => {
            if (error) throw error;
            return result.secure_url;
          }
        )
      );

      // Or use `upload` with `file.buffer`
      const results = await Promise.all(
        req.files.map((file) =>
          cloudinary.uploader.upload_stream_promise
            ? cloudinary.uploader.upload_stream_promise({ folder: "returns" }, file.buffer)
            : cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString("base64")}`, {
                folder: "returns",
              })
        )
      );

      imageUrls = results.map((res) => res.secure_url);
    }

    // Call service layer
    const order = await orderService.returnOrder(orderId, reason, description, imageUrls);

    return res.status(202).json(order);
  } catch (err) {
    console.error("Return Order Error:", err.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};

const approveReturnOrder = async (req, res) => {
  try {
const { status, adminNote, rejectionMessage, returnTime } = req.body;
    const orderId = req.params.orderId;

const updatedOrder = await orderService.approveReturnByAdmin(
  orderId,
  status,
  adminNote,
  rejectionMessage,
  returnTime
);

    return res.status(200).json(updatedOrder);
  } catch (err) {
    console.error("Approve Return Order Error:", err.message);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
};

const getAdminDashboardOverview = async (req, res) => {
  try {
    const overview = await orderService.getAdminDashboardOverview();
    return res.status(200).json({ success: true, data: overview });
  } catch (error) {
    console.error("📉 Error getting dashboard overview:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllOrders,
  confirmedOrder,
  shippOrder,
  deliverOrder,
  cancelledOrder,
  deleteOrder,
  outForDelivery,
  returnOrder,
  approveReturnOrder,
  getAdminDashboardOverview
};
