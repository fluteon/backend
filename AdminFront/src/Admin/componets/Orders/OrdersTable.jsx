import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { MdClose } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { Grid, Select } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmOrder,
  deleteOrder,
  deliveredOrder,
  getOrders,
  shipOrder,
outForDeliveryOrder,
returnedOrder
} from "../../../Redux/Admin/Orders/Action";
import { motion } from 'framer-motion';


import {  getPaymentHistory}  from "../../../Redux/Customers/Payment/Action"

const OrdersTable = () => {
  const [formData, setFormData] = useState({ status: "", sort: "" });
   const dispatch = useDispatch();
  const { history, loading, error } = useSelector((store) => store.payment); // from your combined reducer

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { adminsOrder } = useSelector((store) => store);
  const { totalPages } = adminsOrder
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [anchorElArray, setAnchorElArray] = useState([]);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnMessage, setReturnMessage] = useState("");
  const [returnTime, setReturnTime] = useState(""); // In days
  const [isReturnAccepted, setIsReturnAccepted] = useState(true);
  const [adminNotes, setAdminNotes] = useState("");

  const handleViewPaymentHistory = (userId,orderId) => {
  dispatch(getPaymentHistory(userId, orderId)); // Redux action
  setShowPaymentModal(true); // Open modal
};
 
  function handlePaginationChange(event, value) {
  setPage(value);
}

const handleOpenOrderModal = (order) => {
  setSelectedOrder(order);
  setShowOrderModal(true); // open modal
};

const handleCloseModal = () => {
  setSelectedOrder(null);
  setShowOrderModal(false); // close modal
};

useEffect(() => {
  dispatch(
    getOrders({
      page,
      pageSize: 10,
      status: formData.status,
      sort: formData.sort,
    })
  );
}, [
  page,
  formData.status,
  formData.sort,
  adminsOrder.delivered,
  adminsOrder.shipped,
  dispatch,
  adminsOrder.confirmed,
  adminsOrder.returned,
]);



  const handleUpdateStatusMenuClick = (event, index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = event.currentTarget;
    setAnchorElArray(newAnchorElArray);
  };
  const handleUpdateStatusMenuClose = (index) => {
    const newAnchorElArray = [...anchorElArray];
    newAnchorElArray[index] = null;
    setAnchorElArray(newAnchorElArray);
  };
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData({ ...formData, [name]: value });
  };
  const handleConfirmedOrder = (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(confirmOrder(orderId));
  };
  const handleShippedOrder = (orderId,index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(shipOrder(orderId))
  };
const handleOutForDeliveryOrder = (orderId, index) => {
  handleUpdateStatusMenuClose(index);
  dispatch(outForDeliveryOrder(orderId));
};
  const handleDeliveredOrder = (orderId,index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(deliveredOrder(orderId))
  };
  const handleDeleteOrder = (orderId) => {
    handleUpdateStatusMenuClose();
    dispatch(deleteOrder(orderId));
  };
const paidOrders = adminsOrder?.orders || [];

useEffect(() => {
  if (selectedOrder || showPaymentModal) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }

  return () => (document.body.style.overflow = 'auto');
}, [selectedOrder, showPaymentModal]);


const handleSubmitReturnDecision = () => {
  const payload = {
    orderId: selectedOrder._id,
    status: isReturnAccepted ? "RETURN_APPROVED" : "RETURN_REJECTED",
    adminNote: adminNotes.trim(), // ✅ Send full custom note
    ...(isReturnAccepted && { returnTime }),
    ...(!isReturnAccepted && { rejectionMessage: returnMessage }),
  };

  dispatch(returnedOrder(payload)).then(() => {
    dispatch(getOrders({ page }));
    setShowReturnModal(false);
    setReturnTime("");
    setReturnMessage("");
    setAdminNotes(""); // Clear notes
  });
};

  return (
<>
    {selectedOrder && showOrderModal && (
      
<div className="">
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2 }}
  className="relative backdrop-blur-md bg-white/30 text-black rounded-xl shadow-2xl"
  style={{
    position: "fixed",
    top: "10%",
    left: "30%",
    transform: "translate(-50%, -50%)",
    width: "95vw",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "24px",
    zIndex: 9999,
    borderRadius: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  }}
>


  
      {/* Close Button */}
 <div className="max-h-[90vh] overflow-y-auto p-6">
  <button
  onClick={handleCloseModal}
  className="absolute !top-4 !right-4 !w-12 !h-12 bg-white text-gray-600 rounded-full text-2xl hover:text-red-500 shadow-lg flex items-center justify-center z-50"
  style={{
    top: '1rem',
    right: '1rem',
    width: '48px',
    height: '48px',
    borderRadius: '9999px',
    position: 'absolute',
    zIndex: 9999
  }}
>
  <MdClose size={24} />
</button>

        <h2 className="text-xl font-bold mb-4">Order Details</h2>
      <div className="space-y-2 mb-2 pb-4">
        <p><strong>Order ID:</strong> {selectedOrder._id}</p>
        <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
        <p><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
        <p><strong>Total Price:</strong> ₹{selectedOrder.totalPrice}</p>
        <p><strong>Discounted Price:</strong> ₹{selectedOrder.totalDiscountedPrice}</p>
        <p><strong>Payment ID:</strong> {selectedOrder.paymentDetails?.paymentId}</p>
        <p>
          <strong>Payment Method:</strong>{" "}
          <Chip
            label={selectedOrder.paymentDetails?.paymentMethod || "N/A"}
            size="small"
            color={selectedOrder.paymentDetails?.paymentMethod === "COD" ? "warning" : "primary"}
            sx={{ fontWeight: "bold" }}
          />
        </p>
        <p>
          <strong>Payment Status:</strong>{" "}
          <Chip
            label={selectedOrder.paymentDetails?.paymentStatus || "N/A"}
            size="small"
            color={
              selectedOrder.paymentDetails?.paymentStatus === "COMPLETED" 
                ? "success" 
                : selectedOrder.paymentDetails?.paymentStatus === "PENDING"
                ? "warning"
                : "default"
            }
            sx={{ fontWeight: "bold" }}
          />
        </p>
      </div>
      <hr className="my-4" />
      {/* Shipping Info */}
<h3 className="text-lg font-semibold">Shipping Address</h3>
{selectedOrder?.shippingAddress ? (
  <p>
    {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName},<br />
    {selectedOrder.shippingAddress.mobile},<br />
    {selectedOrder.shippingAddress.streetAddress},<br />
    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state},<br />
    Pincode: {selectedOrder.shippingAddress.zipCode}
  </p>
) : (
  <p className="text-red-600 font-medium">No shipping address available.</p>
)}

      <hr className="my-4" />
      {/* User Info */}
      <h3 className="text-lg font-semibold">Customer</h3>
      <p>{selectedOrder.user.firstName} {selectedOrder.user.lastName}</p>
      <p>{selectedOrder.user.email}</p>
      <hr className="my-4" />
      {/* Order Items */}
      <h3 className="text-lg font-semibold mb-2">Items</h3>
<div className="grid gap-3">
  {selectedOrder.orderItems.map((item, index) => (
    <div key={index} className="flex items-center gap-4 border-b pb-2">
      
      {/* Image wrapper with inline styles */}
      <div
        style={{
          width: "40px",
          height: "40px",
          overflow: "hidden",
          borderRadius: "6px",
          flexShrink: 0,
        }}
      >
        <img
          src={item.product.imageUrl?.[0]}
          alt={item.product.title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      </div>

      <div>
        <p style={{ fontWeight: "500", fontSize: "14px" }}>{item.product.title}</p>
        <p style={{ fontSize: "12px" }}>Qty: {item.quantity}</p>
        <p style={{ fontSize: "12px" }}>Size: {item.size}</p>
        <p style={{ fontSize: "12px" }}>Price: ₹{item.discountedPrice}</p>
      </div>
    </div>
  ))}
</div>


</div>
</motion.div>

    </div>
  

)}

{showPaymentModal && (
    <div className="">
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.2 }}
  className="relative backdrop-blur-md bg-white/30 text-black rounded-xl shadow-2xl"
  style={{
    position: "fixed",
    top: "40%",
    left: "30%",
    transform: "translate(-50%, -50%)",
    width: "95vw",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "24px",
    zIndex: 9999,
    borderRadius: "1rem",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  }}
>
      <button
        style={{
    top: '1rem',
    right: '1rem',
    width: '48px',
    height: '48px',
    borderRadius: '9999px',
    position: 'absolute',
    zIndex: 9999
  }}
        onClick={() => setShowPaymentModal(false)}
        className="absolute !top-4 !right-4 !w-12 !h-12 bg-white text-gray-600 rounded-full text-2xl hover:text-red-500 shadow-lg flex items-center justify-center z-50"
      >
        <MdClose size={24} />
      </button>
      <h2 className="text-xl font-bold mb-4">Payment History</h2>

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-center">No payment history found.</p>
      ) : (
<ul className="space-y-2 max-h-[300px] overflow-y-auto">
  {history.map((payment) => (
    <li key={payment._id} className="border-b pb-2">
      <p><strong>Order ID:</strong> {payment.order?._id || payment.order}</p>
      <p><strong>Payment ID:</strong> {payment.paymentId}</p>
      <p>
        <strong>Status:</strong>{" "}
        <Chip 
          label={payment.status} 
          size="small" 
          color={
            payment.status === "COMPLETED" 
              ? "success" 
              : payment.status === "PENDING"
              ? "warning"
              : "default"
          }
          sx={{ fontWeight: "bold", marginLeft: "8px" }}
        />
      </p>
      <p><strong>Amount:</strong> ₹{payment.amount}</p>
      <p><strong>Paid At:</strong> {new Date(payment.paidAt).toLocaleString()}</p>
      
      {/* Show COD indicator if payment ID contains COD */}
      {payment.paymentId.includes("COD") && (
        <Chip 
          label="Cash on Delivery" 
          size="small" 
          color="warning" 
          sx={{ marginTop: "8px", fontWeight: "bold" }} 
        />
      )}
      
      {/* Show user snapshot */}
      {payment.userSnapshot && (
        <>
          <p className="mt-2 font-semibold">Customer Details</p>
          <p><strong>Name:</strong> {payment.userSnapshot.firstName} {payment.userSnapshot.lastName}</p>
          <p><strong>Email:</strong> {payment.userSnapshot.email}</p>
        </>
      )}
    </li>
  ))}
</ul>

      )}
    </motion.div>
  </div>
)}

{showReturnModal && selectedOrder && (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2 }}
    style={{
      position: "fixed",
      top: "5%",
      left: "25%",
      transform: "translate(-50%, -10%)",
      zIndex: 9999,
    }}
  >
    <Box
      sx={{
        width: "95vw",
        maxWidth: "800px",
        maxHeight: "90vh",
        overflowY: "auto",
        p: 3,
        borderRadius: 4,
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        boxShadow: 8,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          p: 3,
          position: "relative",
        }}
      >
        <IconButton
          onClick={() => setShowReturnModal(false)}
          sx={{ position: "absolute", top: 8, right: 8, color: "gray" }}
        >
          <MdClose size={24} />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2, color: "black" }}>
          Handle Return Request
        </Typography>

        {/* Reason */}
        <Typography variant="body2" sx={{ mb: 1, color:"black" }}>
          <strong>Reason from customer:</strong> {selectedOrder.returnReason}
        </Typography>

        {/* Description */}
        <Typography variant="body2" sx={{ mb: 1, whiteSpace: "pre-wrap", color:"black" }}>
          <strong>Description:</strong> {selectedOrder.returnDescription}
        </Typography>

        {/* Uploaded Images */}
        {selectedOrder.returnImages && selectedOrder.returnImages.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography fontWeight="medium" sx={{ mb: 1, color:"black" }}>
              Submitted Images:
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(2, 1fr)",
                  sm: "repeat(3, 1fr)",
                },
                gap: 1,
              }}
            >
              {selectedOrder.returnImages.map((url, idx) => (
                <Box
                  key={idx}
                  component="img"
                  src={url}
                  alt={`Return Img ${idx}`}
                  sx={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #ccc",
                    color:"black"
                  }}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Decision */}
        <Box sx={{ mb: 2 }}>
          <Typography fontWeight="medium" sx={{ mb: 1 , color:"black"}}>
            Return Decision:
          </Typography>
          <select
            value={isReturnAccepted ? "accept" : "reject"}
            onChange={(e) => setIsReturnAccepted(e.target.value === "accept")}
            style={{
              width: "100%",
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
              color:"black"
            }}
          >
            <option value="accept">Accept</option>
            <option value="reject">Reject</option>
          </select>
        </Box>

        {/* Time or Rejection Message */}
        <Box sx={{ mb: 3, color:"black" }}>
          <Typography fontWeight="medium" sx={{ mb: 1 }}>
            {isReturnAccepted
              ? "Return Processing Time (in days)"
              : "Rejection Message"}
          </Typography>
          <input
            type="text"
            placeholder={
              isReturnAccepted ? "e.g. 5 days" : "e.g. Not eligible for return"
            }
            value={isReturnAccepted ? returnTime : returnMessage}
            onChange={(e) =>
              isReturnAccepted
                ? setReturnTime(e.target.value)
                : setReturnMessage(e.target.value)
            }
            style={{
              width: "100%",
              padding: "10px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </Box>

        {/* Admin Notes */}
        <Box sx={{ mb: 3, color: "black" }}>
          <Typography fontWeight="medium" sx={{ mb: 1 }}>
            Admin Notes (optional)
          </Typography>
<textarea
  rows={3}
  placeholder="Any internal notes regarding this return..."
  value={adminNotes} // ✅ Make sure this is correctly tied
  onChange={(e) => setAdminNotes(e.target.value)} // ✅ No trimming or slicing
  style={{
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    resize: "none",
  }}
/>

        </Box>

        {/* Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button variant="outlined" onClick={() => setShowReturnModal(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={isReturnAccepted ? "success" : "error"}
            onClick={() => handleSubmitReturnDecision()}
          >
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  </motion.div>
)}


          <Box>
      <Card className="p-3">
        <Grid container spacing={2}>
          <Grid item xs={4}>
<FormControl fullWidth>
  <InputLabel id="status-label">Status</InputLabel>
  <Select
    labelId="status-label"
    id="status-select"
    name="status"
    value={formData.status}
    label="Status"
    onChange={handleChange}
  >
    <MenuItem value={"PLACED"}>Placed</MenuItem>
    <MenuItem value={"CONFIRMED"}>Confirmed</MenuItem>
    <MenuItem value={"SHIPPED"}>Shipped</MenuItem>
    <MenuItem value={"OUTFORDELIVERY"}>Out For Delivery</MenuItem>
    <MenuItem value={"DELIVERED"}>Delivered</MenuItem>
    <MenuItem value={"CANCELLED"}>Cancelled</MenuItem>
    <MenuItem value={""}>All</MenuItem> {/* Optional reset */}
  </Select>
</FormControl>

          </Grid>
          <Grid item xs={4}>
<FormControl fullWidth>
  <InputLabel id="sort-label">Sort By</InputLabel>
  <Select
    labelId="sort-label"
    id="sort-select"
    name="sort"
    value={formData.sort}
    label="Sort By"
    onChange={handleChange}
  >
    <MenuItem value={"Newest"}>Newest</MenuItem>
    <MenuItem value={"Oldest"}>Oldest</MenuItem>
  </Select>
</FormControl>

          </Grid>
        </Grid>
      </Card>
      <Card className="mt-2">
        <CardHeader
          title="All Orders"
          sx={{
            pt: 2,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}  
        />
<TableContainer>
  <Table sx={{ minWidth: 800 }} aria-label="table in dashboard">
    <TableHead>
      <TableRow>
        <TableCell>Image</TableCell>
        <TableCell>Title</TableCell>
        <TableCell>Price</TableCell>
        <TableCell>Id</TableCell>
        <TableCell>Payment</TableCell>
        <TableCell>View</TableCell>
        <TableCell sx={{ textAlign: "center" }}>Status</TableCell>
        <TableCell sx={{ textAlign: "center" }}>Update</TableCell>
        <TableCell sx={{ textAlign: "center" }}>Delete</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {paidOrders.map((item, index) => (
        <TableRow
          hover
          key={item._id}
          sx={{ "&:last-of-type td, &:last-of-type th": { border: 0 } }}
        >
          {/* Image Column */}
          <TableCell>
            <AvatarGroup max={4} sx={{ justifyContent: 'start' }}>
              {item.orderItems.map((orderItem, idx) => (
                <Avatar
                  key={idx}
                  alt={orderItem.product?.title}
                  src={orderItem.product?.imageUrl?.[0]}
                />
              ))}
            </AvatarGroup>
          </TableCell>

          {/* Title + Brand */}
          <TableCell >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontWeight: 500, fontSize: "0.875rem !important" }}>
                {item.orderItems.map(o => o.product?.title).filter(Boolean).join(", ")}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                {item.orderItems.map(o => o.product?.brand).filter(Boolean).join(", ")}
              </Typography>
              {/* COD Badge */}
              {item.paymentDetails?.paymentMethod === "COD" && (
                <Chip 
                  label="COD" 
                  size="small" 
                  color="warning" 
                  sx={{ 
                    marginTop: "4px", 
                    fontSize: "0.7rem",
                    height: "20px",
                    fontWeight: "bold"
                  }} 
                />
              )}
            </Box>
          </TableCell>

          {/* Price */}
          <TableCell>{item.totalDiscountedPrice}</TableCell>

          {/* Order ID */}
          <TableCell>{item._id}</TableCell>

          {/* Payment Button */}
          <TableCell>
     <Button
  variant="outlined"
  size="small"
  onClick={() => handleViewPaymentHistory(item.user._id, item._id)}
>
  Payment History
</Button>

          </TableCell>

          {/* View Button */}
          <TableCell>
            <Button
              onClick={() => handleOpenOrderModal(item)}
              variant="outlined"
              size="small"
            >
              View
            </Button>
          </TableCell>

{/* Status Chip */}
<TableCell className="text-white">
  <Chip
    sx={{
      color: "white !important",
      fontWeight: "bold",
      textAlign: "center",
    }}
    label={item.orderStatus}
    size="small"
    color={
      item.orderStatus === "PENDING"
        ? "info"
        : item.orderStatus === "CONFIRMED"
        ? "warning"
        : item.orderStatus === "SHIPPED"
        ? "primary"
        : item.orderStatus === "OUTFORDELIVERY"
        ? "secondary"
        : item.orderStatus === "DELIVERED"
        ? "success"
        : item.orderStatus === "CANCELLED"
        ? "error"
        : "default"
    }
  />
</TableCell>

{/* Status Update Menu */}
<TableCell sx={{ textAlign: "center" }} className="text-white">
  <Button
    id={`basic-button-${item._id}`}
    aria-controls={`basic-menu-${item._id}`}
    aria-haspopup="true"
    aria-expanded={Boolean(anchorElArray[index])}
    onClick={(event) => handleUpdateStatusMenuClick(event, index)}
  >
    Status
  </Button>
  <Menu
    id={`basic-menu-${item._id}`}
    anchorEl={anchorElArray[index]}
    open={Boolean(anchorElArray[index])}
    onClose={() => handleUpdateStatusMenuClose(index)}
    MenuListProps={{ "aria-labelledby": `basic-button-${item._id}` }}
  >
    {/* CONFIRM ORDER */}
    <MenuItem
      onClick={() => handleConfirmedOrder(item._id, index)}
disabled={[
  "CONFIRMED",
  "SHIPPED",
  "OUTFORDELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED_REQUESTED",
  "RETURN_APPROVED",
  "RETURN_REJECTED"
].includes(item.orderStatus?.toUpperCase())}

    >
      CONFIRM ORDER
    </MenuItem>

    {/* SHIP ORDER */}
    <MenuItem
      onClick={() => handleShippedOrder(item._id, index)}
disabled={[
  "SHIPPED",
  "OUTFORDELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED_REQUESTED",
  "RETURN_APPROVED",
  "RETURN_REJECTED"
].includes(item.orderStatus?.toUpperCase())}

    >
      SHIP ORDER
    </MenuItem>

    {/* OUT FOR DELIVERY */}
    <MenuItem
      onClick={() => handleOutForDeliveryOrder(item._id, index)}
disabled={[
  "OUTFORDELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED_REQUESTED",
  "RETURN_APPROVED",
  "RETURN_REJECTED"
].includes(item.orderStatus?.toUpperCase())}

    >
      OUT FOR DELIVERY
    </MenuItem>

    {/* DELIVER ORDER */}
    <MenuItem
      onClick={() => handleDeliveredOrder(item._id, index)}
disabled={[
  "DELIVERED",
  "CANCELLED",
  "RETURNED_REQUESTED",
  "RETURN_APPROVED",
  "RETURN_REJECTED",
  "RETURNED"
].includes(item.orderStatus?.toUpperCase())}

    >
      DELIVER ORDER
    </MenuItem>

    {/* APPROVE RETURN - Opens Modal */}
<MenuItem
onClick={() => {
  handleUpdateStatusMenuClose(index);
  setShowOrderModal(false); // Close Order modal if open
  setSelectedOrder(item);
  setShowReturnModal(true);
}}

  disabled={item.orderStatus !== "RETURNED_REQUESTED"}
>
  APPROVE RETURN
</MenuItem>


  </Menu>
</TableCell>



          {/* Delete Button */}
          <TableCell sx={{ textAlign: "center" }} className="text-white">
            <Button
              onClick={() => handleDeleteOrder(item._id)}
              variant="text"
            >
              delete
            </Button>
          </TableCell>
        </TableRow>
      ))}

      {/* No Data Fallback */}
      {paidOrders.length === 0 && (
        <TableRow>
          <TableCell colSpan={9} align="center">
            No completed (paid) orders found.
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
</TableContainer>

      </Card>
      <Card className="mt-2 felx justify-center items-center">
<Pagination
  className="py-5 w-auto"
  size="large"
  count={totalPages}
  page={page}
  color="primary"
  onChange={handlePaginationChange}
/>

      </Card>
    </Box>

</>
  );
};

export default OrdersTable;

