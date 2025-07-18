import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  MenuItem,
  IconButton,
  Box,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { createdCoupon } from "../../../Redux/Admin/Coupon/Action";
import { motion } from "framer-motion";

const CouponModal = ({ onClose }) => {
  const dispatch = useDispatch();
const { loading, success, error, message } = useSelector((store) => store.createCoupon);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "flat",
    discountValue: "",
    minOrderAmount: "",
    usageLimit: "",
    isActive: true,
    expiresAt: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createdCoupon(formData));
  };

  useEffect(() => {
    if (success) {
      setFormData({
        code: "",
        discountType: "flat",
        discountValue: "",
        minOrderAmount: "",
        usageLimit: "",
        isActive: true,
        expiresAt: "",
      });
    }
  }, [success]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      style={{
        position: "fixed",
        top: "10%",
        left: "25%",
        transform: "translate(-50%, 0%)",
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
          position: "relative",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            color: "#333",
          }}
        >
          <Close />
        </IconButton>

        <Typography variant="h5" align="center" gutterBottom>
          Create New Coupon
        </Typography>

        <form onSubmit={handleSubmit}>
          {success && <Alert severity="success">{message || "Coupon created successfully!"}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            sx={{ mt: 3 }}
            label="Coupon Code"
            name="code"
            fullWidth
            required
            value={formData.code}
            onChange={handleChange}
          />

          <TextField
            sx={{ mt: 3 }}
            label="Discount Type"
            name="discountType"
            fullWidth
            required
            select
            value={formData.discountType}
            onChange={handleChange}
          >
            <MenuItem value="flat">Flat</MenuItem>
            <MenuItem value="percentage">Percentage</MenuItem>
          </TextField>

          <TextField
            sx={{ mt: 3 }}
            label="Discount Value"
            name="discountValue"
            type="number"
            fullWidth
            required
            value={formData.discountValue}
            onChange={handleChange}
          />

          <TextField
            sx={{ mt: 3 }}
            label="Minimum Order Amount"
            name="minOrderAmount"
            type="number"
            fullWidth
            required
            value={formData.minOrderAmount}
            onChange={handleChange}
          />

          <TextField
            sx={{ mt: 3 }}
            label="Usage Limit"
            name="usageLimit"
            type="number"
            fullWidth
            required
            value={formData.usageLimit}
            onChange={handleChange}
          />

          <TextField
            sx={{ mt: 3 }}
            label="Expiry Date"
            name="expiresAt"
            type="date"
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
            value={formData.expiresAt}
            onChange={handleChange}
          />

          <Button
            sx={{ mt: 3 }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            fullWidth
          >
            {loading ? "Creating..." : "Create Coupon"}
          </Button>
        </form>
      </Box>
    </motion.div>
  );
};

export default CouponModal;
