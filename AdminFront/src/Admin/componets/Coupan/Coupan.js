import React, { useEffect, useState } from 'react';
import { Button, Table, TableHead, TableBody, TableCell, TableRow, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import CouponModal from './CouponModal';
import { getAllCoupons } from '../../../Redux/Admin/Coupon/Action';

function Coupan() {
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useDispatch();
const { loading, coupons = [], error } = useSelector((state) => state.createCoupon || {});

  useEffect(() => {
    dispatch(getAllCoupons());
  }, [dispatch, openModal]); // refresh when modal closes

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
        onClick={() => setOpenModal(true)}
      >
        Create Coupon
      </Button>

      {openModal && <CouponModal onClose={() => setOpenModal(false)} />}

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
                <TableCell>{coupon.usedBy.length}</TableCell>
                <TableCell>{coupon.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>{new Date(coupon.expiresAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Coupan;
