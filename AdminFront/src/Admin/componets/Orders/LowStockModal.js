// components/LowStockModal.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Stack,
} from "@mui/material";

const LowStockModal = ({ open, onClose, sizes }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Low Stock Sizes</DialogTitle>
      <DialogContent>
        <Stack spacing={1} direction="row" flexWrap="wrap">
          {sizes
            .filter((size) => size.quantity < 2)
            .map((size, i) => (
              <Chip
                key={i}
                label={`${size.name}: ${size.quantity}`}
                color={size.quantity === 0 ? "error" : "warning"}
              />
            ))}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LowStockModal;
