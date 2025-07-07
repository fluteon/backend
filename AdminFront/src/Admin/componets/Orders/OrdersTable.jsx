import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  FormControl,
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
import { useNavigate } from "react-router-dom";
import { Grid, Select } from "@mui/material";
import { dressPage1 } from "../../../Data/dress/page1";
import { useDispatch, useSelector } from "react-redux";
import {
  confirmOrder,
  deleteOrder,
  deliveredOrder,
  getOrders,
  shipOrder,
outForDeliveryOrder
} from "../../../Redux/Admin/Orders/Action";

import {  getPaymentHistory}  from "../../../Redux/Customers/Payment/Action"
import { configure } from "@testing-library/react";

const OrdersTable = () => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ status: "", sort: "" });
  const [orderStatus, setOrderStatus] = useState("");
  const [paymentHistory, setPaymentHistory] = useState([]);
const { history, loading, error } = useSelector((store) => store.payment); // from your combined reducer

const [showPaymentModal, setShowPaymentModal] = useState(false);

const handleViewPaymentHistory = (userId) => {
  dispatch(getPaymentHistory(userId)); // Redux action
  setShowPaymentModal(true); // Open modal
};

  const dispatch = useDispatch();
  // const jwt = localStorage.getItem("jwt");
  const { adminsOrder } = useSelector((store) => store);
  const [anchorElArray, setAnchorElArray] = useState([]);
  console.log("admin details",adminsOrder)
const [selectedOrder, setSelectedOrder] = useState(null);
const handleOpenOrderModal = (order) => setSelectedOrder(order);

const handleCloseModal = () => setSelectedOrder(null);
  useEffect(() => {
    dispatch(getOrders());
  }, [adminsOrder.delivered, adminsOrder.shipped, adminsOrder.confirmed]);

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
  function handlePaginationChange(event, value) {
    console.log("Current page:", value);
  }
  const handleConfirmedOrder = (orderId, index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(confirmOrder(orderId));
    setOrderStatus("CONFIRMED")
  };
  const handleShippedOrder = (orderId,index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(shipOrder(orderId))
    setOrderStatus("ShIPPED")
  };
const handleOutForDeliveryOrder = (orderId, index) => {
  handleUpdateStatusMenuClose(index);
  dispatch(outForDeliveryOrder(orderId));
  setOrderStatus("OUTFORDELIVERY");
};


  const handleDeliveredOrder = (orderId,index) => {
    handleUpdateStatusMenuClose(index);
    dispatch(deliveredOrder(orderId))
    setOrderStatus("DELIVERED")
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

console.log("Selected Order:", selectedOrder);
console.log("Show Payment Modal:", showPaymentModal);
console.log("Payment History:", history);

  return (
<>
    {selectedOrder && (
      

   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="p-4 bg-[#0d0d22] border text-white rounded-lg shadow-lg max-w-2xl w-full relative">

      {/* Close Button */}
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
      <div className="space-y-2">
        <p><strong>Order ID:</strong> {selectedOrder._id}</p>
        <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
        <p><strong>Date:</strong> {new Date(selectedOrder.orderDate).toLocaleString()}</p>
        <p><strong>Total Price:</strong> ₹{selectedOrder.totalPrice}</p>
        <p><strong>Discounted Price:</strong> ₹{selectedOrder.totalDiscountedPrice}</p>
        <p><strong>Payment ID:</strong> {selectedOrder.paymentDetails?.paymentId}</p>
      </div>
      <hr className="my-4" />
      {/* Shipping Info */}
      <h3 className="text-lg font-semibold">Shipping Address</h3>
      <p>
        {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName},<br />
        {selectedOrder.shippingAddress.mobile},<br />
        {selectedOrder.shippingAddress.streetAddress},<br />
        {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state},<br />
        Pincode: {selectedOrder.shippingAddress.zipCode}
      </p>
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
            <img
              src={`${item.product.imageUrl?.[0]}`}
              alt={item.product.title}
              className="w-16 h-16 object-cover rounded"
            />
            <div>
              <p className="font-medium">{item.product.title}</p>
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹{item.product.price}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  </div>

)}


{showPaymentModal && (


    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="p-4 bg-[#0d0d22] border text-white rounded-lg shadow-lg max-w-2xl w-full relative">
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
      <p><strong>Status:</strong> {payment.status}</p>
      <p><strong>Amount:</strong> ₹{payment.amount}</p>
      <p><strong>Paid At:</strong> {new Date(payment.paidAt).toLocaleString()}</p>
      
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
    </div>
  </div>
)}
          <Box>
      <Card className="p-3">
        <CardHeader
          title="Sort"
          sx={{
            pt: 0,
            alignItems: "center",
            "& .MuiCardHeader-action": { mt: 0.6 },
          }}
        />
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value={"PLACED"}>PLACED</MenuItem>
                <MenuItem value={"CONFIRMED"}>CONFIRMED</MenuItem>
                <MenuItem value={"DELIVERED"}>DELIVERED</MenuItem>
                <MenuItem value={"CANCELD"}>CANCLED</MenuItem>
                <MenuItem value={"OUT FOR DELIVERY"}>OUT FOR DELIVERY</MenuItem>

              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Sort By</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={formData.sort}
                label="Sort By"
                onChange={handleChange}
              >
                <MenuItem value={"Newest"}>Newest</MenuItem>
                <MenuItem value={"Older"}>Older</MenuItem>
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
          <TableCell sx={{ py: (theme) => `${theme.spacing(0.5)} !important` }}>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontWeight: 500, fontSize: "0.875rem !important" }}>
                {item.orderItems.map(o => o.product?.title).filter(Boolean).join(", ")}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                {item.orderItems.map(o => o.product?.brand).filter(Boolean).join(", ")}
              </Typography>
            </Box>
          </TableCell>

          {/* Price */}
          <TableCell>{item.totalPrice}</TableCell>

          {/* Order ID */}
          <TableCell>{item._id}</TableCell>

          {/* Payment Button */}
          <TableCell>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleViewPaymentHistory(item.user._id)}
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
    <MenuItem
      onClick={() => handleConfirmedOrder(item._id, index)}
      disabled={[
        "CONFIRMED",
        "SHIPPED",
        "OUTFORDELIVERY",
        "DELIVERED",
        "CANCELLED",
      ].includes(item.orderStatus?.toUpperCase())}
    >
      CONFIRM ORDER
    </MenuItem>

    <MenuItem
      onClick={() => handleShippedOrder(item._id, index)}
      disabled={[
        "SHIPPED",
        "OUTFORDELIVERY",
        "DELIVERED",
        "CANCELLED",
      ].includes(item.orderStatus?.toUpperCase())}
    >
      SHIP ORDER
    </MenuItem>

    <MenuItem
      onClick={() => handleOutForDeliveryOrder(item._id, index)}
      disabled={[
        "OUTFORDELIVERY",
        "DELIVERED",
        "CANCELLED",
      ].includes(item.orderStatus?.toUpperCase())}
    >
      OUT FOR DELIVERY
    </MenuItem>

    <MenuItem
      onClick={() => handleDeliveredOrder(item._id, index)}
      disabled={["DELIVERED", "CANCELLED"].includes(item.orderStatus?.toUpperCase())}
    >
      DELIVER ORDER
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
          count={10}
          color="primary"
          onChange={handlePaginationChange}
        />
      </Card>
    </Box>

</>
  );
};

export default OrdersTable;
