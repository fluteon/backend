import React, { useEffect, useState } from 'react';
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Typography,
  CircularProgress,
  IconButton,
} from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import CouponModal from './CouponModal';
import {
  getAllCoupons,
  deleteCoupon,
} from '../../../Redux/Admin/Coupon/Action';
import { CREATE_COUPON_SUCCESS } from '../../../Redux/Admin/Coupon/ActionType';

function Coupan() {
  const [openModal, setOpenModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const dispatch = useDispatch();
  const { loading, coupons = [], error } = useSelector((state) => state.createCoupon || {});

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch, openModal]);

  const handleDelete = async (id) => {
    setDeletingId(id);
    await dispatch(deleteCoupon(id));
    setDeletingId(null);
    dispatch(getAllCoupons());
  };

  const handleEdit = (coupon) => {
    dispatch({ type: CREATE_COUPON_SUCCESS, payload: {} });
    setEditingCoupon(coupon);
    setOpenModal(true);
  };

  useEffect(() => {
    if (!openModal) {
      dispatch({ type: CREATE_COUPON_SUCCESS, payload: {} });
      setEditingCoupon(null);
    }
  }, [openModal, dispatch]);

  return (
    <div className="p-4">
      <Button
        variant="outlined"
        sx={{
          color: 'white',
          borderColor: 'white',
          '&:hover': {
            backgroundColor: 'white',
            color: 'black',
          },
        }}
        onClick={() => {
          dispatch({ type: CREATE_COUPON_SUCCESS, payload: {} });
          setEditingCoupon(null);
          setOpenModal(true);
        }}
      >
        Create Coupon
      </Button>

      {openModal && (
        <CouponModal
          onClose={() => setOpenModal(false)}
          couponData={editingCoupon}
        />
      )}

      <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
        All Coupons
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Table sx={{ border: '1px solid #ccc' }}>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Discount Type</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Min Order</TableCell>
              <TableCell>Usage Limit</TableCell>
              <TableCell>Used By</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Expires At</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {coupons.map((coupon) => (
              <TableRow key={coupon._id}>
                <TableCell>{coupon.code}</TableCell>
                <TableCell>{coupon.discountType}</TableCell>
                <TableCell>
                  {coupon.discountType === 'flat'
                    ? `₹${coupon.discountValue}`
                    : `${coupon.discountValue}%`}
                </TableCell>
                <TableCell>₹{coupon.minOrderAmount}</TableCell>
                <TableCell>{coupon.usageLimit}</TableCell>
                <TableCell>{coupon.usedBy?.length || 0}</TableCell>
                <TableCell>{coupon.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  {coupon.expiresAt
                    ? new Date(coupon.expiresAt).toLocaleDateString()
                    : 'N/A'}
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(coupon)} color="primary" sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(coupon._id)}
                    disabled={deletingId === coupon._id}
                    color="error"
                  >
                    {deletingId === coupon._id ? (
                      <CircularProgress size={24} />
                    ) : (
                      <DeleteIcon />
                    )}
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Coupan;
